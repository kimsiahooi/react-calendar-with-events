import { useState, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';

const App = () => {
  const [calendarDays, setCalendarDays] = useState([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const taskDateRef = useRef();
  const taskDescRef = useRef();

  useEffect(() => {
    if (!localStorage.getItem('oks-calendar')) {
      const currentDate = new Date();
      const month = currentDate.getMonth();
      const year = currentDate.getFullYear();
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      const firstDayOfWeek = firstDayOfMonth.getDay();
      const totalDays = lastDayOfMonth.getDate();

      const tempCalendar = [];
      for (let i = 0; i < firstDayOfWeek; i++) {
        tempCalendar.push({
          id: nanoid(),
          blank: true,
        });
      }

      for (let day = 1; day <= totalDays; day++) {
        tempCalendar.push({
          id: nanoid(),
          blank: false,
          text: day,
          tasks: [],
        });
      }

      localStorage.setItem('oks-calendar', JSON.stringify(tempCalendar));
      setCalendarDays(tempCalendar);
    } else {
      setCalendarDays(JSON.parse(localStorage.getItem('oks-calendar')));
    }
  }, []);

  const showAddTaskModalHandler = () => {
    setShowAddTaskModal(true);
  };

  const closeAddTaskModalHandler = () => {
    setShowAddTaskModal(false);
  };

  const deleteTaskHandler = (calendarId, taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      const tempCalendar = calendarDays.map((calendarDay) => {
        if (calendarDay.id === calendarId) {
          const tempTask = calendarDay.tasks.filter((task) => task.id !== taskId);
          return { ...calendarDay, tasks: tempTask };
        } else {
          return calendarDay;
        }
      });
      localStorage.setItem('oks-calendar', JSON.stringify(tempCalendar));
      setCalendarDays(tempCalendar);
    }
  };

  const editTaskHandler = (calendarId, taskId, taskDesc) => {
    const newTaskDesc = prompt('Edit your task:', taskDesc);
    if (newTaskDesc !== null && newTaskDesc.trim() !== '') {
      const tempCalendar = calendarDays.map((calendarDay) => {
        if (calendarDay.id === calendarId) {
          const tempTasks = calendarDay.tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, description: newTaskDesc };
            }
            return task;
          });
          return { ...calendarDay, tasks: tempTasks };
        } else {
          return calendarDay;
        }
      });
      localStorage.setItem('oks-calendar', JSON.stringify(tempCalendar));
      setCalendarDays(tempCalendar);
    }
  };

  const addTaskHandler = () => {
    const taskDate = new Date(taskDateRef.current.value);
    const taskDesc = taskDescRef.current.value.trim();

    if (taskDesc && !isNaN(taskDate.getDate())) {
      const tempCalendar = calendarDays.map((calendarDay) => {
        if (calendarDay.blank || calendarDay.text !== taskDate.getDate()) {
          return calendarDay;
        } else {
          const tempTasks = calendarDay.tasks;
          tempTasks.push({ id: nanoid(), description: taskDesc });
          return { ...calendarDay, tasks: tempTasks };
        }
      });
      localStorage.setItem('oks-calendar', JSON.stringify(tempCalendar));
      setCalendarDays(tempCalendar);
    } else {
      alert('Please enter a valid date and description!');
    }

    closeAddTaskModalHandler();
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      <div className="text-center pt-5 pb-[60px]">
        <h1>Event Calendar</h1>
        <div
          id="calendar"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-[10px] p-5">
          {calendarDays.map((calendarDay) => {
            if (calendarDay.blank) {
              return <div key={calendarDay.id}></div>;
            }
            return (
              <div
                key={calendarDay.id}
                className="flex flex-col items-center bg-white text-[#c4c4c4] p-[15px] rounded-[8px] min-h-[70px] shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
                {calendarDay.text}
                {calendarDay.tasks.map((task) => (
                  <div
                    className="bg-[#212121] text-white p-3 mt-[10px] rounded text-center break-words text-[0.8em] w-[88%] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#424242]"
                    key={task.id}
                    onContextMenu={() => deleteTaskHandler(calendarDay.id, task.id)}
                    onClick={() => editTaskHandler(calendarDay.id, task.id, task.description)}>
                    {task.description}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <button
        className="fixed bottom-5 left-1/2 -translate-x-1/2 text-white bg-[#212121] py-[10px] px-12 border-none rounded-[20px] cursor-pointer transition-all ease-in-out duration-300 shadow-[0_4px_8px_rgba(0,0,0,0.2)] hover:bg-[#424242]"
        onClick={showAddTaskModalHandler}>
        Add Task
      </button>

      {showAddTaskModal && (
        <div id="add-task-modal" className="fixed z-10 left-0 top-0 w-full h-full overflow-auto bg-black/70">
          <div className="bg-white mx-auto my-[15%] p-5 border border-[#888] border-solid w-[300px] rounded-[14px] text-center">
            <span
              className="text-[#aaa] float-right text-[28px] font-bold cursor-pointer transition-all duration-300 ease-in-out hover:text-black focus:text-black"
              onClick={closeAddTaskModalHandler}>
              &times;
            </span>
            <h2>Add Task</h2>
            <input
              type="date"
              id="task-date"
              ref={taskDateRef}
              className="w-full p-[10px] my-[10px] mx-auto inline-block border border-solid border-[#ccc] rounded-[10px] outline-none"
            />
            <input
              type="text"
              id="task-desc"
              placeholder="Task Description"
              ref={taskDescRef}
              className="w-full p-[10px] my-[10px] mx-auto inline-block border border-solid border-[#ccc] rounded-[10px] outline-none"
            />
            <button
              onClick={addTaskHandler}
              className="bg-[#212121] text-white py-[10px] px-12 my-2 mx-auto border-none rounded-[14px] cursor-pointer transition-all duration-300 ease-in-out hover:text-[#424242]">
              Add Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
