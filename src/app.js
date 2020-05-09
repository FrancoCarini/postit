import { http } from './http'
import { ui } from './ui'

// Get posts on DOM load
document.addEventListener('DOMContentLoaded', () => {
  getPosts()
});

// Add or edit post when click the submit button
document.querySelector('.post-submit').addEventListener('click', async () => {
  // Capture title and body from UI
  const title = document.querySelector('#title').value;
  const body = document.querySelector('#body').value;
  const id = document.querySelector('#id').value;
    
  // Validate inputs
  if (title === '' || body === '') {
    ui.showAlert('Please add values for both fields', 'alert alert-danger')
  } else {
    // Data to insert
    const data = {
      title,
      body
    }

    // New or Edit post
    // Check for id
    if (id === '') {
      // Create Post
      try {
        await http.post('http://localhost:3000/posts', data);
        ui.showAlert('Post Added', 'alert alert-success');
        ui.clearFields();
      } catch (err) {
        console.log(err);
      }
    } else {
      // Update Post
      try {
        await http.put(`http://localhost:3000/posts/${id}`, data);
        ui.showAlert('Post Updated', 'alert alert-success');
        ui.changeFormState('add');
      } catch (err) {
        console.log(err);
      }
    }
    getPosts();
  }
})

// Delete post when click the remove icon
document.querySelector('#posts').addEventListener('click', async (e) => {
  e.preventDefault();
  if (e.target.parentElement.classList.contains('delete')) {
    const id = e.target.parentElement.dataset.id;
    try {
      await http.delete(`http://localhost:3000/posts/${id}`)
      ui.showAlert('Post Removed', 'alert alert-success');
      getPosts()
    } catch (err) {
      console.log(err);
    }
  }
});

// Lister for edit state
document.querySelector('#posts').addEventListener('click', async (e) => {
  e.preventDefault();
  if (e.target.parentElement.classList.contains('edit')) {
    const id = e.target.parentElement.dataset.id;

    // Capture title and body
    const body = e.target.parentElement.previousElementSibling.textContent;
    const title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;

    const data = {
      id,
      title,
      body
    };

    // Fill form with current post
    ui.fillForm(data);
  }
});

// Listen for cancel
document.querySelector('.card-form').addEventListener('click', async (e) => {
  e.preventDefault();
  if (e.target.classList.contains('post-cancel')) {
    ui.changeFormState('add');
  }
})

// Function to get and show posts
const getPosts = async () => {
  try {
    const posts = await http.get('http://localhost:3000/posts');
    ui.showPosts(posts);
  } catch (err) {
    console.log(err);
  }
}