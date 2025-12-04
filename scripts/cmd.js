const cmdInput = document.getElementById('cmd-input');
const cmdOutput = document.getElementById('cmd-output');
const cmdBody = document.getElementById('cmd-body');

let cmdHistory = [];
let historyIndex = -1;

// Focus input on click
cmdBody.addEventListener('click', () => cmdInput.focus());

cmdInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = cmdInput.value.trim();
        if (command) {
            processCommand(command);
            cmdHistory.push(command);
            historyIndex = cmdHistory.length;
        }
        cmdInput.value = '';
    } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
            historyIndex--;
            cmdInput.value = cmdHistory[historyIndex];
        }
        e.preventDefault();
    } else if (e.key === 'ArrowDown') {
        if (historyIndex < cmdHistory.length - 1) {
            historyIndex++;
            cmdInput.value = cmdHistory[historyIndex];
        } else {
            historyIndex = cmdHistory.length;
            cmdInput.value = '';
        }
        e.preventDefault();
    }
});

function printOutput(text, isHtml = false) {
    const div = document.createElement('div');
    div.className = 'cmd-line';
    if (isHtml) {
        div.innerHTML = text;
    } else {
        div.textContent = text;
    }
    cmdOutput.appendChild(div);
    cmdBody.scrollTop = cmdBody.scrollHeight;
}

function processCommand(cmd) {
    // Echo command
    printOutput(`C:\\Users\\Relaxman> ${cmd}`);

    const args = cmd.split(' ');
    const command = args[0].toLowerCase();

    switch (command) {
        case 'help':
            printOutput('Available commands:');
            printOutput('  help     - Show this help message');
            printOutput('  cls      - Clear screen');
            printOutput('  date     - Show current date');
            printOutput('  whoami   - Show current user');
            printOutput('  about    - Show about info');
            printOutput('  contact  - Show contact info');
            printOutput('  game     - Start a mini game (game [dino|tetris])');
            printOutput('  ls       - List directory contents');
            break;
        case 'cls':
        case 'clear':
            cmdOutput.innerHTML = '';
            break;
        case 'date':
            printOutput(new Date().toString());
            break;
        case 'whoami':
            printOutput('relaxman');
            break;
        case 'about':
            printOutput('----------------------------------------');
            printOutput(' Name: Chin Jeung (a.k.a Cedric)');
            printOutput(' Role: AI Builder / Data Engineer');
            printOutput(' Motto: "Habit overcomes disposition."');
            printOutput('----------------------------------------');
            break;
        case 'contact':
            printOutput('Email: relaxman@example.com');
            printOutput('GitHub: github.com/wlswjd');
            break;
        case 'ls':
        case 'dir':
            printOutput(' Directory of C:\\Users\\Relaxman');
            printOutput('');
            printOutput('12/04/2025  10:00 AM    <DIR>          .');
            printOutput('12/04/2025  10:00 AM    <DIR>          ..');
            printOutput('12/04/2025  10:05 AM             1,024 secret.txt');
            printOutput('12/04/2025  10:05 AM               512 project_notes.doc');
            printOutput('');
            break;
        case 'cat':
        case 'type':
            if (args[1] === 'secret.txt') {
                printOutput('This is a secret file. You found an easter egg!');
                printOutput('Try typing "matrix" for a cool effect (coming soon).');
            } else if (args[1]) {
                printOutput(`File not found: ${args[1]}`);
            } else {
                printOutput('Usage: cat [filename]');
            }
            break;
        case 'game':
            if (args[1] === 'dino') {
                printOutput('Starting Dino Run...');
                switchTab('game');
            } else if (args[1] === 'tetris') {
                printOutput('Starting Tetris...');
                switchTab('tetris');
            } else {
                printOutput('Usage: game [dino|tetris]');
            }
            break;
        default:
            printOutput(`'${command}' is not recognized as an internal or external command.`);
            break;
    }
}

