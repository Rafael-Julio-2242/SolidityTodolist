"use client";

import { RippleButton } from "@/components/animate-ui/buttons/ripple";
import { Task } from "../todo-list/todo-list";
import { Check, CircleCheckBig, Edit, Trash2, X } from "lucide-react";
import CompletedTag from "../completed-tag/completed-tag";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { GetSigner } from "@/helpers/getSigner";
import { GetContractInfo } from "@/serverActions/getContractInfo";
import { ethers } from "ethers";
import Swall from "sweetalert2";

export default function TodoItem({
  task,
  updateTasks,
}: {
  task: Task;
  updateTasks: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTodoName, setEditTodoName] = useState(task.name);

  const [isUpdating, setIsUpdating] = useState(false);

  const editTodo = () => {
    setIsEditing(!isEditing);
  };

  const handleEditTodo = async () => {
    const signer = await GetSigner();

    if (!signer) return;

    try {
      setIsUpdating(true);

      const { abi, address } = await GetContractInfo();

      const contract = new ethers.Contract(address, abi, signer);

      const tx = await contract.updateTask(task.id, editTodoName);

      await tx.wait();

      setIsEditing(false);
      updateTasks();
    } catch (e: any) {
      console.log("[ERROR ON EDIT TODO]: ", e);
      alert("Erro ao editar tarefa!");
    } finally {
      setIsUpdating(false);
    }
  };

  const completeTask = async () => {
    setIsUpdating(true);

    const result = await Swall.fire({
      title: "Do you want to complete this task?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Complete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      setIsUpdating(false);
      return;
    }

    try {
      const signer = await GetSigner();

      if (!signer) {
        alert("Please, connect your wallet to complete a todo!");
        setIsUpdating(false);
        return;
      }

      const { abi, address } = await GetContractInfo();

      const contract = new ethers.Contract(address, abi, signer);

      const tx = await contract.completeTask(task.id);

      await tx.wait();

      updateTasks();
      setIsUpdating(false);
    } catch (e: any) {
      console.log("Erro ao completar tarefa: ", e);
      setIsUpdating(false);
    }
  };

  const deleteTask = async () => {
   setIsUpdating(true);

   const result = await Swall.fire({
    title: "Do you want to delete this task?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
   });

   if (!result.isConfirmed) {
    setIsUpdating(false);
    return;
   }

   try {
    const signer = await GetSigner();

    if (!signer) {
     alert("Please, connect your wallet to delete a todo!");
     setIsUpdating(false);
     return;
    }

    const { abi, address } = await GetContractInfo();

    const contract = new ethers.Contract(address, abi, signer);

    const tx = await contract.deleteTask(task.id);

    await tx.wait();

    updateTasks();
    setIsUpdating(false);
   } catch (e: any) {
    console.log("Erro ao deletar tarefa: ", e);
    setIsUpdating(false);
   }


  }

  return (
    <div
      className={`flex gap-4 w-full ${
        isEditing ? "px-4" : "px-10"
      } py-4 my-2 justify-between items-center border-2 rounded-full border-gray-400`}
      key={task.id}
    >
      {isEditing ? (
        <Input
          className="m-0 w-[150px]"
          value={editTodoName}
          onChange={(e) => setEditTodoName(e.target.value)}
          disabled={isUpdating}
        />
      ) : (
        <p>{task.name}</p>
      )}
      <CompletedTag completed={task.isCompleted} />
      <div className="self-end flex gap-2">
        {isEditing && (
          <RippleButton disabled={isUpdating} onClick={handleEditTodo}>
            <Check />
          </RippleButton>
        )}
        <RippleButton onClick={editTodo} disabled={isUpdating}>
          {isEditing ? <X /> : <Edit />}
        </RippleButton>
        <RippleButton disabled={isUpdating} onClick={deleteTask}>
          <Trash2 />
        </RippleButton>
        {!isEditing && (
          <RippleButton disabled={isUpdating} onClick={completeTask}>
            <CircleCheckBig />
          </RippleButton>
        )}
      </div>
    </div>
  );
}
