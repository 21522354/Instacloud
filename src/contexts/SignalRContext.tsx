import React, { createContext, useContext, useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { HostNameChatService, HostNameNotificationService } from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SignalRContextType {
  connection: HubConnection | null;
  isConnected: boolean;
}

const SignalRContext = createContext<SignalRContextType>({
  connection: null,
  isConnected: false,
});

export const useSignalR = () => useContext(SignalRContext);

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const startConnection = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;

        const newConnection = new HubConnectionBuilder()
            .withUrl(`${HostNameNotificationService}/notificationHub`, {
              withCredentials: false,
          })
          .withAutomaticReconnect()
          .build();

          newConnection.start().then(function () {
          console.log("Connected to SignalR hub.");
       
            //joinChatExample(connection);
        }).catch(function (err) {
            return console.error(err.toString());
        });
        setConnection(newConnection);
        setIsConnected(true);


      } catch (error) {
        console.error('SignalR Connection Error:', error);
      }
    };

    startConnection();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  return (
    <SignalRContext.Provider value={{ connection, isConnected }}>
      {children}
    </SignalRContext.Provider>
  );
};
