# Online-Chat-App
Chat	application	that	allows	to	handle	multiple	chat	clients	simultaneously.	In	particular,
connected	clients	can:	list	the	members	already	logged	in,	log	in,	exchange	messages	with	other	logged	in	users and sent images thru chat. Server also archive all exhcange messages in database.
The	chat	server	can	accept	and	maintain	connections	to	all	the	clients	and	relay	chat	messages	between	them.
Used	technologies:	Spring	Boot,	Spring	Security,	Websocket,	PostgreSQL	database	and	STOMP
library.

<p align="center">
    <img src="https://i.imgur.com/Yy5cBxf.png">
  </a>

## App is available online:
    https://gg-chat-mesenger.herokuapp.com/
    
## Getting started

    1.Download the code
    git clone https://gg-chat-messenger.herokuapp.com/app
    2.Adjust database properties in application.properties
    3.Run application
    4.Go to address localhost:8080/
    5.Create account
    6.Login 
    7.To test app with multple users:
      a)open new private windows
      b)delete your cookies
      c)create another account
      
