// Tests are done using Mochajs
const TasksContract = artifacts.require("TasksContract");

contract("TasksContract", () => {
    
    before(async () => {
        this.tasksContract =  await TasksContract.deployed();
    })

    it('migrate deployed successfully', async () => {
        const address = this.tasksContract.address;

        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
    })

    it('get Tasks List', async () => {
        const taskCounter = await this.tasksContract.taskCounter();
        const task = await this.tasksContract.tasks(taskCounter - 1);

        assert.equal(task.id.toNumber(), taskCounter - 1);
        assert.equal(task.title, "Task #1");
        assert.equal(task.description, "Description #1");
        assert.equal(task.done, false);
    })

    it('Task Created Successfully', async () => {
        const result = await this.tasksContract.createTask("test task", "test description");
        const taskEvent = result.logs[0].args;

        assert.equal(taskEvent.id.toNumber(), 1);
        assert.equal(taskEvent.title , "test task");
        assert.equal(taskEvent.description , "test description");
        assert.equal(taskEvent.done , false);
    })

    it('Task Toggle Done Successfully', async () => {
        const taskCounter = await this.tasksContract.taskCounter();
        const currentState = await this.tasksContract.tasks(taskCounter - 1).done;
        const toggleResult = await this.tasksContract.toggleDone(taskCounter - 1);
        const newState = toggleResult.logs[0].args.done;

        assert.notEqual(currentState, newState);
    })

})