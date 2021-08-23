console.log('Hello World');

App = {
    contracts: {},
    web3Provider: '',

    init: async () => {
        console.log("Loaded");
        await App.loadEthereum();
        await App.loadAccount();
        App.renderAccount();
        await App.loadContracts();
        await App.renderTask();
    },

    loadEthereum : async () => {
        if (window.ethereum) {
            console.log('Ethereum Exists !');
            App.web3Provider = window.ethereum;
            await window.ethereum.request({method: 'eth_requestAccounts'})
        }else if(window.web3) {
            web3 = new Web3(window.web3.currentProvider)
        }else {
            alert("You have to install Metamask to use this app");
        }
    },

    loadAccount: async () => {
       const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
       App.account = accounts[0];
    },

    loadContracts: async () => {
        const res = await fetch("TasksContract.json");
        const tasksContractJSON = await res.json();
        
        App.contracts.tasksContract = TruffleContract(tasksContractJSON);
        App.contracts.tasksContract.setProvider(App.web3Provider);
        App.tasksContract = await App.contracts.tasksContract.deployed();

    },

    renderAccount: () => {
        document.getElementById("account").innerText = App.account;
    } ,

    renderTask: async () => {
        // First we get the total number of tasks
        const taskCounter = await App.tasksContract.taskCounter();
        const taskCounterNumber = taskCounter.toNumber();
        console.log(taskCounterNumber);

        let html = '';

        for (let i = 1; i <= taskCounterNumber; i++) {
            const task = await App.tasksContract.tasks(i);
            const taskId = task[0];
            const taskTitle = task[1];
            const taskDescription = task[2];
            const taskDone = task[3];
            const taskCreated = task[4];

            let taskElement = `
                <div class="card bg-dark rounded-0 mb-2" >
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>${taskTitle}</span>
                        
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" ${taskDone && "checked"} onchange="App.toggleDone(${taskId})" />
                        </div>
                    </div>
                    <div class="card-body">
                        <span>${taskDescription}</span>
                        <p class="text-muted">Task created at: ${new Date(taskCreated * 1000).toLocaleString()}</p>
                    </div>
                </div>
            `;

            html += taskElement;
        }

        document.getElementById("taskList").innerHTML = html;

    },

    createTask: async (title, description) => {
        const result = await App.tasksContract.createTask(title, description, { 
            from: App.account,
        });
        window.location.reload();
    },

    toggleDone: async (id) => {
        const result = await App.tasksContract.toggleDone(id, {
            from: App.account
        });

        window.location.reload();
    }
}
