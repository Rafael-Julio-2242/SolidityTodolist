// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Todolist {
 struct Task {
  uint256 id;
  string name;
  bool isCompleted;
 }

 uint256 private taskCount;
 mapping(uint256 => Task) private tasks;
 uint256[] private tasksIds;
 Task lastUpdatedTask;

 constructor() {
  taskCount = 0;
 }

 function createTask(string memory _name) public {
  Task memory task = Task(taskCount, _name, false);
  tasks[taskCount] = task;
  tasksIds.push(taskCount);
  taskCount++;
 }

 function getTask(uint256 _id) public view returns (Task memory) {
  return tasks[_id];
 }

 function updateTask(uint256 _id, string memory name) public {
  tasks[_id].name = name;
  lastUpdatedTask = tasks[_id];
 }

 function getUpdatedTask() public view returns (Task memory) {
  return lastUpdatedTask;
 }

 function deleteTask(uint256 _id) public {
  delete tasks[_id];

  for (uint256 i = 0; i < tasksIds.length; i++) {
   if (tasksIds[i] == _id) {
    tasksIds[i] = tasksIds[tasksIds.length - 1];
    tasksIds.pop();
    break;
   }
  }
 }

 function getTasksIds() public view returns (uint256[] memory) {
  return tasksIds;
 }

 function completeTask(uint256 _id) public {
  tasks[_id].isCompleted = true;
 }

}
