import { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

const Chat = ({ socket, username, room }) => {
	const [currentMessage, setCurrentMessage] = useState('')
	const [messageList, setMessageList] = useState([])
	var counter = 0

	const sendMessage = async () => {
		if (currentMessage.trim() !== '') {
			const messageData = {
				id: counter++,
				room: room,
				author: username,
				message: currentMessage,
				time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
			}

			await socket.emit('send_message', messageData)
			setMessageList(list => [...list, messageData])
			setCurrentMessage('')
		}
	}

	useEffect(() => {
		socket.on('recieve_message', data => {
			setMessageList(list => [...list, data])
		})
	}, [socket])

	return (
		<div className='chat-window'>
			<div className='chat-header'>
				<p>Live Chat</p>
			</div>
			<div className='chat-body'>
				<ScrollToBottom className='message-container'>
					{messageList
						? messageList.map(item => {
								return (
									<div className='message' id={username === item.author ? 'other' : 'you'}>
										<div>
											<div className='message-content'>
												<p>{item.message}</p>
											</div>
											<div className='message-meta'>
												<p id='time'>{item.time}</p>
												<p id='author'>{item.author}</p>
											</div>
										</div>
									</div>
								)
						  })
						: null}
				</ScrollToBottom>
			</div>
			<div className='chat-footer'>
				<input
					type='text'
					value={currentMessage}
					placeholder='Message'
					onChange={e => {
						setCurrentMessage(e.target.value)
					}}
					onKeyPress={e => {
						if (e.key === 'Enter') sendMessage()
					}}
				/>
				<button onClick={sendMessage}>&#9658;</button>
			</div>
		</div>
	)
}

export default Chat
