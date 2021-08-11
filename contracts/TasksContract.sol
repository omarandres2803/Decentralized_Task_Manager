// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TasksContract {

    uint public taskCounter = 0 ;

    event TaskCreated(
        uint id,
        string title,
        string description,
        bool done
    ) ;

    event TaskToggleDone(
        uint id,
        bool done
    );

    struct Task {
        uint id;
        string title;
        string description;
        bool done;
        uint createdAt;
    }

    constructor() {
        createTask("Task #1", "Description #1");
    }

    mapping (uint => Task ) public tasks ;

    function createTask(string memory _title, string memory _description) public {
        tasks[taskCounter] = Task(taskCounter, _title, _description, false, block.timestamp);
        emit TaskCreated(taskCounter, _title, _description, false);
        taskCounter++;
    }

    function toggleDone(uint _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
        emit TaskToggleDone(_id, _task.done);
    }

}