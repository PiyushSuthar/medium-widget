const template = document.createElement('template')

template.innerHTML = `
<style>
.medium-blogpost {
  width: 300px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(131, 131, 131, 0.2);
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
    sans-serif;
  border-radius: 8px;
}
.medium-blogpost-author {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid rgba(131, 131, 131, 0.2);
}
.medium-blogpost-author-img img {
  width: 80px;
  border-radius: 50%;
  margin: 10px;
}
.medium-blogpost-author-info h3 {
  margin: 0;
  font-size: 20px;
}
.medium-blogpost-author-info p {
  margin: 0;
  font-size: 12px;
  color: rgba(68, 68, 68, 0.8);
}
.medium-blogpost-articles {
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow: auto;
}
a {
  text-decoration: none;
}
.medium-blogpost-single-article {
  padding: 10px;
  color: black;
  border-bottom: 1px solid rgba(131, 131, 131, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 100px;
  color: white;
}

.medium-blogpost-single-article h3 {
  margin: 0;
}
.medium-blogpost-single-article p {
  margin: 0;
  margin-top: 5px;
  font-size: 12px;
}
.medium-follow-button {
  margin-top: 5px;
  border: none;
  outline: none;
  /* padding: 5px 10px; */
  background: none;
  color: rgba(3, 168, 124, 1);
  /* border: 2px solid; */
  border: solid rgba(3, 168, 124, 1) 1px;
  border-radius: 4px;
  cursor:pointer;
}
</style>
<div class="medium-blogpost">
<div class="medium-blogpost-author">
  <div class="medium-blogpost-author-img">
    
  </div>
  <div class="medium-blogpost-author-info">
    
  </div>
</div>
<div class="medium-blogpost-articles">
</div>
</div>

`
class MediumBlogpost extends HTMLElement {
    constructor() {
        super()
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true)); 
    }
    async fetchPosts(username) {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`)
        const data = await response.json()
        return data
    }
    connectedCallback(){
        this.username = this.getAttribute("username")
        this.render()
    }
    renderUser(data){
        this._shadowRoot.querySelector('.medium-blogpost-author-img').innerHTML = `<img src="${data.feed.image}" alt="${this.name}"/>`
        this._shadowRoot.querySelector('.medium-blogpost-author-info').innerHTML = `<h3>${data.items[0].author}</h3><p>@${this.username}</p><a href="https://medium.com/@${this.username}" target="_blank"><button class="medium-follow-button">Follow</button></a>`
    }

    renderArticles(data=[]){
        data.forEach(data =>{
            this._shadowRoot.querySelector('.medium-blogpost-articles').innerHTML +=`<a style="background: linear-gradient(to bottom,rgba(37, 37, 37, 0.349), rgba(27, 27, 27, 0.678)), url('${data.thumbnail}');background-size: contain;"class="medium-blogpost-single-article" href="${data.link}" target="_blank"><h3>${data.title}</h3><p>${this.parseDate(data.pubDate)}</p></a>`
        })
    }
    parseDate(date) {
        const IsoStringToDate = new Date(date);
        const parsedDate = IsoStringToDate.toUTCString().slice(5).slice(0, -13);
        return parsedDate;
      };

    async render(){
        const data =  await this.fetchPosts(this.username)
        this.renderUser(data)
        this.renderArticles(data.items)
    }
}

customElements.define('medium-blogpost', MediumBlogpost)