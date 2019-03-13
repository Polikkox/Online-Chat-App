# Online-Chat-App
Chat	application	that	allows	to	handle	multiple	chat	clients	simultaneously.	In	particular,
connected	clients	can:	list	the	members	already	logged	in,	log	in,	exchange	messages	with	other	logged	in	users.
The	chat	server	can	accept	and	maintain	connections	to	all	the	clients	and	relay	chat	messages	between	them.
Used	technologies:	Spring	Boot,	Spring	Security,	Hibernate,	Websocket,	PostgreSQL	database	and	STOMP
library.

<p align="center">
    <img src="https://i.imgur.com/YuNF5Ns.png">
  </a>

## To-do
- Add feature sending message on pressing enter 
- Archiving messages in database
- Add sound when receiving messages
- Logout function
- Enable possibility to sending images
- Add emoji

**Getting started**

    1.Download the code
    git clone https://github.com/Polikkox/Online-Chat-App/
    2.Adjust database properties in application.properties
    3.Run application
    4.Go to address localhost:8080/
    5.Create account
    6.Login 
    7.To test app with multple users:
      a)open new private windows
      b)delete your cookies
      c)create another account
      
