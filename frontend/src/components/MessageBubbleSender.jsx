import React, { useEffect, useState } from "react";

const MessageBubbleSender = ({image_source, username}) => {
	return (
		<img src={image_source} alt={`User ${username}`}
			style={{
				paddingLeft: 5,
				paddingRight: 5,
				width: 40,
				height: 40,
				borderRadius: '100%',
				objectFit: 'cover',
			}}
		/>
	);
};

export default MessageBubbleSender;
