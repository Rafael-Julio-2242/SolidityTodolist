"use client";

import { RippleButton } from "../animate-ui/buttons/ripple";
import { useConnection } from "../context/connectionContext";
import TodoList from "../handmade/todo-list/todo-list";

export default function HomePage() {
  const { isConnected, connect, account } = useConnection();

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center relative">
      {!isConnected ? (
        <RippleButton
          className="absolute right-8 top-8 bg-white text-black hover:bg-black hover:text-white"
          rippleClassName="bg-white"
          onClick={connect}
        >
          Connect Wallet
        </RippleButton>
      ) : (
        <></>
      )}
      <h1>TodoList</h1>
      <TodoList account={account} />
    </div>
  );
}
