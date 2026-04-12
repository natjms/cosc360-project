import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import MessageBubble from './components/MessageBubble';
import ConversationTab from './components/ConversationTab';
import './Conversations.css';

const Conversations = (props) => {
	const [conversations, setConversations] = useState([]);
	const [show_complete_conversations, setShowCompleteConversations] = useState(false);

	const [active_conversation, setActiveConversation] = useState(null);
	const [active_conversation_id, setActiveConversationId] = useState(null);
	const [message_poll_timer, setMessagePollTimer] = useState(null);

	const [new_message, setNewMessage] = useState('');

	const [messages, setMessages] = useState([]);
	const [myAccount, setMyAccount] = useState(null);
	const account_id = localStorage.getItem('account_id');
	const session_token = localStorage.getItem('token');

	// Convenience state for the "other person" you're talking to, rather than
	// have to compute it on the fly every time
	const [otherPerson, setOtherPerson] = useState(null);

	useEffect(() => {
		(async () => {
			await fetchConversations();
			const account = await fetch(`/api/accounts/${account_id}`, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Basic ${session_token}`,
				},
			});
			setMyAccount(await account.json());
		})();
	}, []);

	const fetchConversations = async () => {
		let uri = `/api/conversations/${account_id}`
		if (show_complete_conversations) {
			uri += '?complete=true';
		}

		const response = await fetch(uri, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Basic ${session_token}`,
			},
		});

		setConversations(await response.json());
	}

	useEffect(() => {
		console.log('re-requesting conversations');
		fetchConversations();
	}, [show_complete_conversations]);

    useEffect(() => {
        return () => {
            if (message_poll_timer) {
                clearInterval(message_poll_timer);
            }
        };
    });

	const pollMessages = async () => {
		console.log(`Polling messages at ${Date.now()}`);
		const response = await fetch(`/api/conversations/${account_id}/${active_conversation_id}`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Basic ${session_token}`,
			},
		});

		const complete_conversation = await response.json();
		if (!active_conversation || complete_conversation.messages.length >= active_conversation.messages.length) {
			// New messages have arrived, so we'll update
			setActiveConversation(complete_conversation);
		}

		setOtherPerson(
			account_id === complete_conversation.initiator._id ?
				complete_conversation.recipient
				: complete_conversation.initiator
		);
	};

	useEffect(() => {
		(async () => {
			if (active_conversation_id === null) {
				return;
			}

			clearInterval(message_poll_timer);
			await pollMessages();

			setMessagePollTimer(setInterval(pollMessages, 10000));
		})();
	}, [active_conversation_id]);

	const handleSendMessage = async () => {
		const message_response = await fetch(`/api/conversations/${account_id}/${active_conversation_id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Basic ${session_token}`,
			},
			body: JSON.stringify({
				content: new_message,
			}),
		});

		const message_result = await message_response.json();

		setNewMessage('');
		setActiveConversation({...active_conversation,
			messages: [...active_conversation.messages, message_result]
		});
	};

	const handleCompleteConversation = async () => {
		const response = await fetch(`/api/conversations/${account_id}/${active_conversation_id}/complete`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Basic ${session_token}`,
			},
		});

		setActiveConversation({...active_conversation,
			messages: [...active_conversation.messages, message_result]
		});
	};

	return <>
		<div className='conversations-page-container'>
			<div className='conversations-sidebar'>
				<div className='conversations-sidebar-inner'>
					<button onClick={() => setShowCompleteConversations(!show_complete_conversations)}>
						{ !show_complete_conversations ?
							'Show complete conversations'
							: 'Show incomplete conversations'
						}
					</button>
					{ conversations.length > 0 ?
						<ul className='conversation-tab-list'>
							{ conversations.map((c, i) =>
								<ConversationTab
									key={i}
									conversation={c}
									onClick={() => setActiveConversationId(c._id)}/>
							)}
						</ul>
						: <p>Nothing to show</p>
					}
				</div>
			</div>
			<div className='conversations-message-window'>
				{ active_conversation !== null && otherPerson !== null ?
					<>
						<div className='conversation-window-header'>
							<img
								src={`/api${otherPerson.imagePath}`}
								alt={`${otherPerson.username}'s profile photo`}/>
							<h2>{otherPerson.username}</h2>

							{ !active_conversation.complete &&
								<button onClick={handleCompleteConversation}>
									Mark complete
								</button>
							}
						</div>
						<div className='conversation-messages'>
							<div className='context-container'>
								<Link to={`/catalog/${active_conversation.context.catalog_entry.isbn}`}>
									<img src={active_conversation.context.catalog_entry.cover}/>
								</Link>
								<div>
									<p>
										You{"'"}re discussing {active_conversation.recipient.username}{"'"}s
										copy of <em>{active_conversation.context.catalog_entry.title}</em>
									</p>
									<p><small>
										You can use this conversation to arrange for a trade or pickup. Be sure
										not to share any unnecessary personal information
									</small></p>
								</div>
							</div>
							<ul>
								{ active_conversation.messages.map((m, i) =>
									<MessageBubble
										key={i}
										message={m.content}
										alignment={m.sender === otherPerson._id ? 'left' : 'right'}
										sender_src={
											m.sender === otherPerson._id ?
												`/api${otherPerson.imagePath}`
												: `/api${myAccount.imagePath}`
										} />
								)}
							</ul>

							{ active_conversation.complete &&
								<p className='conversation-complete-message'>This conversation has been completed</p>
							}
						</div>

						<div className='message-window-send-bar'>
							<input
								value={new_message}
								placeholder='Say something...'
								onChange={(e) => setNewMessage(e.target.value)}/>
							<button onClick={handleSendMessage}>
								Send
							</button>
						</div>
					</>
					:<></>
				}
			</div>
		</div>
	</>;
};

export default Conversations;
