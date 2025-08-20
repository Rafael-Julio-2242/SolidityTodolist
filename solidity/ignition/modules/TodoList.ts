import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule("Todolist", (m) => {
 const todoList = m.contract("TodoList");

 return { todoList }
});
