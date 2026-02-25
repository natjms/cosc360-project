import React, { useEffect, useState } from "react";
import MessageBubbleSender from "./MessageBubbleSender.jsx";

const MessageBubble = ({message, alignment, sender_src}) => {
	const bubble_colour = alignment === 'left' ? '#FFE797' : 'green';
	return <div style={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: alignment === 'left' ?
					'flex-start' : 'flex-end',
				alignItems: 'flex-end',
			}}>
		{alignment === 'left' &&
			<MessageBubbleSender
				image_source={sender_src}
				username='Test user'/>
		}
		<div style={{
			backgroundColor: bubble_colour,
			borderRadius: 10,
			width: 480,
			height: 'auto',
			padding: 10,
			fontFamily: 'sans-serif',
			fontSize: '0.8em',
		}}>
			{message}
		</div>
		{alignment === 'right' &&
			<MessageBubbleSender
				image_source={sender_src}
				username='Test user'/>
		}
	</div>;
};

export default MessageBubble;
