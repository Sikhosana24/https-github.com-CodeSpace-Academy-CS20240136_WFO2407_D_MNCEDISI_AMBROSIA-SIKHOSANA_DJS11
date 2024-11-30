/* Custom styles for Podcast App */

/* Global styles */
body {
  font-family: 'Inter', sans-serif;
}

/* Header styles */
.App header {
  background: linear-gradient(to right, #4a00e0, #8e2de2);
}

/* Card styles */
.card {
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Button styles */
.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Form element styles */
select, input[type="text"], input[type="search"] {
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

select:focus, input[type="text"]:focus, input[type="search"]:focus {
  border-color: #4a00e0;
  box-shadow: 0 0 0 2px rgba(74, 0, 224, 0.2);
}

/* Audio player styles */
.audio-player {
  background: linear-gradient(to right, #f7f7f7, #e3e3e3);
  border-top: 2px solid #4a00e0;
}

/* Loading spinner styles */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner {
  border: 4px solid rgba(74, 0, 224, 0.1);
  border-left-color: #4a00e0;
  animation: spin 1s linear infinite;
}

/* Responsive design improvements */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

/* Accessibility improvements */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focus styles for keyboard navigation */
a:focus, button:focus, input:focus, select:focus {
  outline: 2px solid #4a00e0;
  outline-offset: 2px;
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #1a1a1a;
    color: #f0f0f0;
  }

  .card {
    background-color: #2a2a2a;
  }

  .audio-player {
    background: linear-gradient(to right, #2a2a2a, #3a3a3a);
    border-top: 2px solid #8e2de2;
  }

  select, input[type="text"], input[type="search"] {
    background-color: #2a2a2a;
    color: #f0f0f0;
    border-color: #4a4a4a;
  }

  select:focus, input[type="text"]:focus, input[type="search"]:focus {
    border-color: #8e2de2;
    box-shadow: 0 0 0 2px rgba(142, 45, 226, 0.2);
  }
}