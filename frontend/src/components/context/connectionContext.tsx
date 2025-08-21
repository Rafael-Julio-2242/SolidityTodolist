import { createContext, ReactNode, useContext, useState } from 'react';


type ConnectionContextType = {
  isConnected: boolean;
  account: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

type ConnectionProviderProps = {
  children: ReactNode
}


export function ConnectionProvider({ children }: ConnectionProviderProps) {

  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const connect = async () => {

    try {

      if ((window as any).ethereum) {

        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });

        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }

      } else {
        alert("Por favor, instale o MetaMask para continuar!")
      }


    } catch (e: any) {
      console.log("Erro ao conectar: ", e)
      setIsConnected(false);
      setAccount(null);
    }

  }


  const disconnect = () => {
    setIsConnected(false);
    setAccount(null);
  }


  const value = {
    isConnected,
    account,
    connect,
    disconnect
  }

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  )
}


export function useConnection() {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }

  return context;
}
