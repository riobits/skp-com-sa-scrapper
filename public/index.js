const searchForm = document.getElementById('search-form')
const statusEl = document.getElementById('status')
const urlInput = document.querySelector('input[name="url"]')
const limitInput = document.querySelector('input[name="limit"]')
const submitBtn = document.querySelector('button[type="submit"]')

const SUCCESS_MESSAGE = 'تم تشغيل السكريبر'
const FAILED_MESSAGE = 'حدث خطأ اثناء تشغيل السكريبر, تواصل مع المطور.'

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  submitBtn.setAttribute('disabled', 'true')
  submitBtn.classList.add('disabled')

  const response = await fetch('http://localhost:5000/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: urlInput.value,
      limit: limitInput.value,
    }),
  })

  const data = await response.json()

  if (data.status === 'success') {
    statusEl.classList.add('success')
    statusEl.innerText = SUCCESS_MESSAGE
  } else {
    statusEl.classList.add('failed')
    statusEl.innerText = FAILED_MESSAGE
  }

  setTimeout(() => {
    submitBtn.removeAttribute('disabled')
    submitBtn.className = ''
    statusEl.innerText = ''
  }, 5000)
})
