const GOOGLE_DOMAIN = process.env.GOOGLE_DOMAIN;

const qids = {
    'hootsuite': 1,
    'google': 2,
    'arcgis': 3,
};

const config = require('./config.json');

module.exports = function(db) {

    const AuthService = require('../auth/auth.service.js');
    const { oauthApiCall } = new AuthService(db);

    const jacketFields = [
        'expedition',
        'jacketNumber',
        'created',
        'locality',
        'specimenType',
    ];
    const jacketFieldsString = jacketFields.map((field) => `j.${field}`).join(', ');

    const jacketsSelectQuery = `select j.jid, ${jacketFieldsString}, u.fullname from queue_items q left join jackets j on j.jid=q.jid left join users u on u.uid=j.juid where q.qid=$1`;
    const getQueue = async (provider) => {
        if (!(provider in qids)) { return []; }
        const qid = qids[provider];
        const jacketsSelectResult = await db.query(jacketsSelectQuery, [qid]);
        return jacketsSelectResult.rows;
    };

    const jacketSelectQuery = `select j.jid, ${jacketFieldsString}, u.fullname, u.email from queue_items q left join jackets j on j.jid=q.jid left join users u on u.uid=j.juid where q.qid=$1 and j.jid=$2`;
    const getQueueItem = async (provider, jid) => {
        if (!(provider in qids)) { return {}; }
        const qid = qids[provider];
        const jacketSelectResult = await db.query(jacketSelectQuery, [qid, jid]);
        if (!jacketSelectResult.rows.length) { return {}; }
        return jacketSelectResult.rows[0];
    };

    const itemDeleteQuery = 'delete from queue_items where qid=$1 and jid=$2';
    const deleteQueueItem = async (provider, jid) => {
        if (!(provider in qids)) { throw { message: `Unknown provider ${provider}` }; }
        const qid = qids[provider];
        await db.query(itemDeleteQuery, [qid, jid]);
    };

    const participantsSelectQuery = 'select uid, fullname, email from participants';
    const getParticipants = async () => {
        const participantsSelectResults = await db.query(participantsSelectQuery, []);
        if (!participantsSelectResults.rows.length) { return []; }
        return participantsSelectResults.rows;
    };

    const participantEmailsSelectQuery = 'select email from participants where uid=any($1::int4[])';
    const _mapParticipantUIDsToEmail = async (participants) => {
        const participantEmailsSelectResults = await db.query(participantEmailsSelectQuery, [participants]);
        if (!participantEmailsSelectResults.rows.length) { return []; }
        return participantEmailsSelectResults.rows.map((result) => result.email);
    };
    const _normalizeJacketNumber = (number) => {
        // strip all non-alphanumerics except dashes and spaces
        number = number.replace(/[^0-9A-Za-z -]/g, '');
        // convert all spaces to dashes
        return number.replace(/ /g, '-');
    };
    const _createGoogleGroup = async (jid) => {
        const provider = 'google';
        try {
            const jacketSelectResult = await db.query(jacketSelectQuery, [qids[provider], jid]);
            if (!jacketSelectResult.rows.length) { return { status: 'not_found', message: `Jacket ${jid} not found` }; }
            const jacketNumber = jacketSelectResult.rows[0].jacketnumber;
            const email = `${_normalizeJacketNumber(jacketNumber)}@${GOOGLE_DOMAIN}`;
            const groupInsertBody = {
                email: email,
                description: `This is an announcements-only group for information about ${jacketNumber}.`,
                name: jacketNumber,
            };
            const response = await oauthApiCall(provider, 'POST', '/admin/directory/v1/groups', groupInsertBody);
            const gid = response.id;
            return { status: 'ok', email: email, gid: gid, jacketNumber: jacketNumber };
        }
        catch (err) {
            return { status: 'create_failed', message: `Group creation failed because ${JSON.stringify(err)}.  Try to fix the issue, and try again later.` };
        }
    };
    const _patchGoogleGroupPermissions = async (email) => {
        const defaultPermissions = {
            whoCanJoin: 'INVITED_CAN_JOIN',
            whoCanViewMembership: 'ALL_MANAGERS_CAN_VIEW',
            whoCanViewGroup: 'ALL_MEMBERS_CAN_VIEW',
            whoCanInvite: 'ALL_MANAGERS_CAN_INVITE',
            whoCanAdd: 'ALL_MANAGERS_CAN_ADD',
            allowExternalMembers: 'true',
            whoCanPostMessage: 'ALL_MANAGERS_CAN_POST',
            allowGoogleCommunication: 'false',
            includeInGlobalAddressList: 'false',
            whoCanLeaveGroup: 'ALL_MEMBERS_CAN_LEAVE',
            whoCanContactOwner: 'ALL_MEMBERS_CAN_CONTACT',
            whoCanApproveMembers: 'ALL_MANAGERS_CAN_APPROVE',
            whoCanDiscoverGroup: 'ALL_MEMBERS_CAN_DISCOVER',
        };
        try {
            await oauthApiCall('google', 'PATCH', `/groups/v1/groups/${encodeURIComponent(email)}`, defaultPermissions);
            // ignore response; it simply contains all the group settings
            return { status: 'ok' };
        }
        catch (err) {
            return { status: 'permissions_failed', message: `Group ${email} created.  However, settings for permissions failed because ${JSON.stringify(err)}.  You will need to manually set permissions, add users, and send a welcome message.  Copy the list of users, and save it in a spreadsheet to help you keep track of invitations.` };
        }
    };
    const _addMembersToGoogleGroup = async (email, gid, participants) => {
        // add self as group owner
        try {
            const myProfile = await oauthApiCall('google', 'GET', '/gmail/v1/users/me/profile');
            const participantSettings = {
                delivery_settings: 'ALL_MAIL',
                email: myProfile.emailAddress,
                role: 'OWNER',
            };
            await oauthApiCall('google', 'POST', `/admin/directory/v1/groups/${gid}/members`, participantSettings);
        }
        catch (err) {
            return {
                status: 'ownership_failed',
                message: `Group ${email} created.  However, a group owner could not be assigned to the group because ${JSON.stringify(err)}.  You will need to manually add users, and send a welcome message.  Copy the list of users, and save it in a spreadsheet to help you keep track of invitations.`,
                remaining_members: participants,
            };
        }
        // add participants as members
        let participant;
        while (participant = participants.pop()) {
            try {
                const participantSettings = {
                    delivery_settings: 'ALL_MAIL',
                    email: participant,
                    role: 'MEMBER',
                };
                await oauthApiCall('google', 'POST', `/admin/directory/v1/groups/${gid}/members`, participantSettings);
            }
            catch (err) {
                participants.push(participant);
                return {
                    status: 'membership_failed',
                    message: `Group ${email} created.  However, some participants were not able to be added to the group because ${JSON.stringify(err)}.  You will need to manually add users, and send a welcome message.  Copy the list of users, and save it in a spreadsheet to help you keep track of invitations.`,
                    remaining_members: participants,
                };
            }
        };
        return { status: 'ok' };
    };
    const _createGmailDraft = async (email, draftMessage) => {
        try {
            const message = { message: {
                // Base64 URL-safe encoding
                raw: Buffer.from(draftMessage, 'utf8').toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
            } };
            await oauthApiCall('google', 'POST', '/gmail/v1/users/me/drafts', message);
            return { status: 'ok' };
        }
        catch (err) {
            return { status: 'draft_failed', message: `Group ${email} created and members added.  However, creation of draft Gmail message failed because ${JSON.stringify(err)}.  You will need to manually send a welcome message.  Copy the template below if it helps.` };
        }
    };
    const putParticipants = async (jid, participants) => {
        // map the participant IDs to email addresses
        participantEmails = await _mapParticipantUIDsToEmail(participants);
        if (participantEmails.length != participants.length) {
            return { status: 'missing_participants', message: 'Could not find some participant UIDs' };
        }
        // try to create the Google group
        const createResponse = await _createGoogleGroup(jid);
        if (createResponse.status !== 'ok') { return createResponse; }
        const { email, gid, jacketNumber } = createResponse;
        const draftMessage = config.google.draftMessage
            .replace(/{email}/g, email)
            .replace(/{jacketNumber}/g, jacketNumber)
            .replace(/{unsubscribe}/g, email.replace('@', '+unsubscribe@'))
            .replace(/{owners}/g, email.replace('@', '+owner@'));
        // remove the item from the queue: any retry would otherwise try to recreate the already created group
        await deleteQueueItem('google', jid);
        // update the group permissions
        const permissionsResponse = await _patchGoogleGroupPermissions(email, gid);
        if (permissionsResponse.status !== 'ok') {
            permissionsResponse.draft_message = draftMessage;
            permissionsResponse.remaining_members = participantEmails;
            return permissionsResponse;
        }
        // add members to the group
        const membershipResponse = await _addMembersToGoogleGroup(email, gid, participantEmails);
        if (membershipResponse.status !== 'ok') {
            membershipResponse.draft_message = draftMessage;
            return membershipResponse;
        }
        // save a draft welcome message
        const draftResponse = await _createGmailDraft(email, draftMessage);
        if (draftResponse.status !== 'ok') { return draftResponse; }
        return { status: 'ok', message: `Remember to send a welcome mail to the group ${email}.  Check your draft mailbox for a template.` };
    };

    return {
        getQueue: getQueue,
        getQueueItem: getQueueItem,
        deleteQueueItem: deleteQueueItem,
        getParticipants: getParticipants,
        putParticipants: putParticipants,
    };

};
