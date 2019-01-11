(function() {
  const form = document.querySelector('#search-form')
  const searchField = document.querySelector('#search-keyword')
  const imageContainer = document.querySelector('.image-container')
  const articlesContainer = document.querySelector('.articles-container')
  let searchedForText

  form.addEventListener('submit', function(event) {
    event.preventDefault()
    imageContainer.innerHTML = ''
    articlesContainer.innerHTML = ''
    searchedForText = searchField.value

    const imageRequest = new XMLHttpRequest()

    imageRequest.onload = addImage;
    imageRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`)
    imageRequest.setRequestHeader('Authorization', 'Client-ID 462d22cae6dd1d4877bb082c9e9c6502893a9bb7305d4bf8f681d13b56d4abc3')
    imageRequest.send()

    const articlesRequest = new XMLHttpRequest()

    articlesRequest.onload = addArticles;
    articlesRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=e6a9801dab184d89a4d77b94ff44048c`)
    articlesRequest.send()
  })

  function addImage() {
    const data = JSON.parse(this.responseText)
    const firstImage = data.results[0]

    imageContainer.insertAdjacentHTML(
      'afterbegin',
      `<figure>
        <img src="${firstImage.urls.full}" alt="${searchedForText}">
        <figcaption>${searchedForText} by ${firstImage.user.username}</figcaption>
      </figure>`
    )
  }

  function addArticles() {
    const data = JSON.parse(this.responseText)
    const articles = data.response.docs.map(article =>
      `<li>
        <h2><a href="${article.web_url}>${article.headline.main}</a></h2>
        <p>${article.snippet}</p>
      </li>`
    )

    articlesContainer.insertAdjacentHTML(
      'afterbegin',
      `<ul>${articles.join('')}</ul>`
    )
  }
})()