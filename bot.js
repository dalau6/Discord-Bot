const eris = require('eris');

const PREFIX = 'pb!';
const BOT_OWNER_ID = '523407722880827415';
const PREMIUM_CUTOFF = 10;

const bot = new eris.Client('my_token');

const premiumRole = {
   name: 'Premium Member',
   color: 0x6aa84f,
   hoist: true, // Show users with this role in their own section of the member list.
};

async function updateMemberRoleForDonation(guild, member, donationAmount) {
   // If the user donated more than $10, give them the premium role.
   if (guild && member && donationAmount >= PREMIUM_CUTOFF) {
       // Get the role, or if it doesn't exist, create it.
       let role = Array.from(guild.roles.values())
           .find(role => role.name === premiumRole.name);

       if (!role) {
           role = await guild.createRole(premiumRole);
       }

       // Add the role to the user, along with an explanation
       // for the guild log (the "audit log").
       return member.addRole(role.id, 'Donated $10 or more.');
   }
}

const commandForName = {};
commandForName['addpayment'] = {
   botOwnerOnly: true,
   execute: (msg, args) => {
       const mention = args[0];
       const amount = parseFloat(args[1]);
       const guild = msg.channel.guild;
       const userId = mention.replace(/<@(.*?)>/, (match, group1) => group1);
       const member = guild.members.get(userId);

       // TODO: Handle invalid command arguments, such as:
       // 1. No mention or invalid mention.
       // 2. No amount or invalid amount.

       return Promise.all([
           msg.channel.createMessage(`${mention} paid $${amount.toFixed(2)}`),
           updateMemberRoleForDonation(guild, member, amount),
       ]);
   },
};