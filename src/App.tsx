import { useEffect, useState, FormEvent } from "react";

interface Task {
    id: string;
    name: string;
    complete: boolean;
}

function App() {
    const [name, setName] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('http://localhost:8000/tasks');
                if (!response.ok) throw new Error('Failed to fetch tasks');
                const content: Task[] = await response.json();
                setTasks(content);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        })();
    }, []);

    const create = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/tasks', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name
                })
            });

            if (!response.ok) throw new Error('Failed to create task');
            const task: Task = await response.json();
            setTasks([...tasks, task]);
            setName('');
        } catch (error) {
            console.error('Error creating task:', error);
        }
    }

    const update = async (id: string, checked: boolean) => {
        try {
            const response = await fetch(`http://localhost:8000/tasks/${id}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    complete: checked
                })
            });

            if (!response.ok) throw new Error('Failed to update task');
            const updatedTask = { id, complete: checked };
            setTasks(tasks.map(task => task.id === id ? { ...task, ...updatedTask } : task));
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    const del = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                const response = await fetch(`http://localhost:8000/tasks/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('Failed to delete task');
                setTasks(tasks.filter(t => t.id !== id));
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    }

    return (
        <section className="vh-100">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">

                        <div className="card" style={{ borderRadius: '15px' }}>
                            <div className="card-body p-5">

                                <h2 className="mb-3">Tasks List</h2>

                                <form className="d-flex justify-content-center align-items-center mb-4" onSubmit={create}>
                                    <div className="form-outline flex-fill">
                                        <input type="text" id="form3" className="form-control form-control-lg"
                                            value={name}  // Bind the value to state
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-lg ms-2">Add</button>
                                </form>

                                <ul className="list-group mb-0">
                                    {tasks.map(task => (
                                        <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2">
                                            <div className="d-flex align-items-center">
                                                <input className="form-check-input me-2" type="checkbox"
                                                    aria-label="..."
                                                    checked={task.complete}
                                                    onChange={e => update(task.id, e.target.checked)}
                                                />
                                                {task.name}
                                            </div>
                                            <a href="#!" data-mdb-toggle="tooltip" title="Remove item"
                                                onClick={() => del(task.id)}
                                            >delete
                                                <i className="fas fa-times text-primary"></i>
                                            </a>
                                        </li>
                                    ))}
                                </ul>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default App;
