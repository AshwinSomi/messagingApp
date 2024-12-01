interface User {
  name: string;
  email: string;
  image: string;
  id: string;
}

interface Chat {
  id: string;
  message: Message[];
}

interface Message {
  id: string;
  senderId: string;
  receivedId: string;
  text: string;
  timeStamp: number;
}

interface FriendRequest {
  id: string;
  senderId: string;
  receivedId: string;
}
