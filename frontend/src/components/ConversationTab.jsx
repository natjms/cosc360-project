import React from 'react';

const ConversationTab = ({conversation, onClick}) => {
	const account_id = localStorage.getItem('account_id');
	let messenger

	if (conversation.last_message === null) {
		messenger = account_id === conversation.initiator._id ?
			conversation.recipient
			: conversation.initiator;
	} else {
		messenger = conversation.last_message.sender === conversation.initiator._id ?
			conversation.initiator
			: conversation.recipient;
	}

	return <li className='conversation-tab' role='button' onClick={onClick}>
		<img
			className='conversation-tab-thumbnail'
			src={`/api${messenger.imagePath}`}
			alt={`${messenger.username}'s profile photo`}/>
		<div>
			<p className='conversation-tab-title'>
				{conversation.recipient.username}{"'"}s copy of {conversation.context.catalog_entry.title}
			</p>
		</div>
	</li>;
};

export default ConversationTab;
