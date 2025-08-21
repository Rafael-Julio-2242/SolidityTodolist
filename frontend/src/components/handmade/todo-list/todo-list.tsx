"use client";
import { RippleButton } from "@/components/animate-ui/buttons/ripple";
import { RotateCcw } from "@/components/animate-ui/icons/rotate-ccw";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GetContractInfo } from "@/serverActions/getContractInfo";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import TodoItem from "../todo-item/todo-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GetSigner } from "@/helpers/getSigner";
import Swall from 'sweetalert2';

export interface Task {
  id: number;
  name: string;
  isCompleted: boolean;
}

export default function TodoList({ account }: { account: string | null }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTodo, setNewTodo] = useState(false);

  const [newTodoName, setNewTodoName] = useState("");

  const getSigner = async () => {
    if (!account) {
      alert("Please, connect your wallet!");
      return;
    }

    return await GetSigner();
  };

  const searchTasks = async () => {
    if (!account) {
      alert("Please, connect your wallet to update todo list!");
      return;
    }

    const signer = await getSigner();

    if (!signer) return;

    try {
      setIsUpdating(true);

      const { abi, address } = await GetContractInfo();

      const contract = new ethers.Contract(address, abi, signer);

      const tasksIds = await contract.getTasksIds();

      let searchedTasks = [];

      for (const taskId of tasksIds) {
        const task = await contract.getTask(taskId);

        searchedTasks.push({
          id: Number(task.id),
          name: task.name,
          isCompleted: task.isCompleted,
        });
      }

      
      searchedTasks = searchedTasks.sort((a, b) => b.id - a.id);

      console.log("Tarefas encontradas: ", searchedTasks);

      setTasks(searchedTasks);
    } catch (e: any) {
      console.log("[ERROR ON SEARCH TASKS]: ", e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddTodo = async () => {
    if (!account) {
      alert("Please, connect your wallet to add a todo!");
      return;
    }
    const signer = await getSigner();

    if (!signer) return;

    try {
      setIsUpdating(true);
      const { abi, address } = await GetContractInfo();

      const contract = new ethers.Contract(address, abi, signer);

      const tx = await contract.createTask(newTodoName);

      const receipt = await tx.wait();

      console.log("Transação confirmada: ", receipt);

      setNewTodo(false);
      setNewTodoName("");
      searchTasks();
    } catch (e: any) {
      console.log("Erro ao adicionar tarefa: ", e);
      setIsUpdating(false);
    }
  };

  const addTodo = () => {
    setNewTodo(true);
  };

  useEffect(() => {
    searchTasks();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 border-2 border-gray-400 min-w-[500px] min-h-[500px] relative">
      <div className="flex justify-between w-full">
        <RippleButton
          disabled={isUpdating}
          className="m-8"
          onClick={searchTasks}
        >
          <RotateCcw animateOnHover={true} />
          Atualizar
        </RippleButton>
        <RippleButton disabled={isUpdating} className="m-8" onClick={addTodo}>
          Adicionar
        </RippleButton>
      </div>

      {newTodo && (
        <>
          <Label htmlFor="newTodo">New Todo</Label>
          <div className="flex gap-4 w-full px-20 py-2 justify-between items-center">
            <Input
              id="newTodo"
              value={newTodoName}
              onChange={(e) => setNewTodoName(e.target.value)}
              placeholder="Type your todo here..."
            />
            <RippleButton disabled={isUpdating} onClick={handleAddTodo}>
              Adicionar
            </RippleButton>
          </div>
        </>
      )}
      
      <ScrollArea className="flex flex-col mx-8 px-8 gap-y-12 h-[400px]">
        {tasks.map((task) => (
          <TodoItem key={task.id} task={task} updateTasks={searchTasks} />
        ))}  
      </ScrollArea>      
      
    </div>
  );
}
