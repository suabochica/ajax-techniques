(function() {
  let searchedForText
  const form = document.querySelector('#search-form')
  const searchField = document.querySelector('#search-keyword')
  const imageContainer = document.querySelector('.image-container')
  const articlesContainer = document.querySelector('.articles-container')

  form.addEventListener('submit', function(event) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'

    event.preventDefault()
    imageContainer.innerHTML = ''
    articlesContainer.innerHTML = ''
    searchedForText = searchField.value

    fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
      {
        headers: {
          Authorization: 'Client-ID 462d22cae6dd1d4877bb082c9e9c6502893a9bb7305d4bf8f681d13b56d4abc3'
        }
      }
    )
    .then(response => response.json())
    .then(addImage)

    fetch(`${proxyUrl}http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=e6a9801dab184d89a4d77b94ff44048c`)
    .then(response => response.json())
    .then(addArticles)
  })

  function addImage(data) {
    let htmlContent = ''

    if (data && data.results && data.results[0]) {
      const firstImage = data.results[0]

      htmlContent = `<figure>
          <img src="${firstImage.urls.full}" alt="${searchedForText}">
          <figcaption>${searchedForText} by ${firstImage.user.username}</figcaption>
        </figure>`
    } else {
      htmlContent = '<div class="error-no-image">No images available</div>'
    }

    imageContainer.insertAdjacentHTML('afterbegin', htmlContent)
  }

  function addArticles(data) {
    let htmlContent = ''

    if (data.response && data.response.docs && data.response.docs.length > 1) {
      htmlContent = '<ul>' +
        data.response.docs.map(article =>
            `<li>
              <h2><a href="${article.web_url}>${article.headline.main}</a></h2>
              <p>${article.snippet}</p>
            </li> `
          ).join('')
        + '</ul>'
    } else {
      htmlContent = '<div class="error-no-articles">No articles available</div>'
    }

    articlesContainer.insertAdjacentHTML('afterbegin', htmlContent)
  }
})()