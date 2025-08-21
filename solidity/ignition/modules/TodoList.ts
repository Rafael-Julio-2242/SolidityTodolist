import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule("Todolist", (m) => {
 const todoList = m.contract("Todolist");

 return { todoList }
});
