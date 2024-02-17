using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers

{
    [Route("api/[controller]")]
    public class TaskController : Controller

    {
        private readonly ApplicationDbContext dbContext;

        public TaskController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet] //Get all tasks
        public async Task<ActionResult<IEnumerable<TaskModel>>> Get()
        {
            try
            {
                var tasks = await dbContext.Tasks.ToListAsync();
                return tasks;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message,
                    error = ex.InnerException?.Message
                });
            }
        }

        [HttpGet("{id}")] //Get a task by id
        public async Task<ActionResult<TaskModel>> Get(int id)
        {
            try
            {
                var taskById = await dbContext.Tasks.FindAsync(id);

                if (taskById == null)
                {
                    return NotFound();
                }

                return taskById;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message,
                    error = ex.InnerException?.Message
                });
            }
        }

        [HttpPost] //Create a new task
        public async Task<ActionResult<TaskModel>> Post([FromBody] TaskModel TaskModel)
        {
            try
            {
                dbContext.Tasks.Add(TaskModel);
                await dbContext.SaveChangesAsync();
                return Ok(new {
                    success = true,
                    message = "Task created successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message,
                    error = ex.InnerException?.Message
                });
            }
        }

        [HttpPut("{id}")] // Update existing task > api/values/5
        public async Task<IActionResult> Put(int id, [FromBody] TaskModel updatedTask)
        {
            try
            {
                var existingTask = await dbContext.Tasks.FindAsync(id);

                if (existingTask == null)
                {
                    return NotFound();
                }

                dbContext.Entry(existingTask).CurrentValues.SetValues(updatedTask);
                await dbContext.SaveChangesAsync();
                return Ok(new { 
                    success = true,
                    message = "Task updated successfully" 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message,
                    error = ex.InnerException?.Message
                });
            }
        }

        [HttpDelete("{id}")] // DELETE: api/values/5
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var taskToDelete = await dbContext.Tasks.FindAsync(id);

                if (taskToDelete == null)
                {
                    return NotFound();
                }

                dbContext.Tasks.Remove(taskToDelete);
                await dbContext.SaveChangesAsync();
                return Ok(new
                {
                    success = true,
                    message = "Task deleted successfully" 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message,
                    error = ex.InnerException?.Message
                });
            }
        }
    }
}