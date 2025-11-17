import IdeasApi from '../Services/ideasApi';

class IdeaList {
  constructor() {
    this.idealistEl = document.querySelector('#idea-list');
    this._ideas = [];
    this.getIdeas();

    this._validTags = new Set();
    this._validTags.add('technology');
    this._validTags.add('business');
    this._validTags.add('software');
    this._validTags.add('education');
    this._validTags.add('health');
    this._validTags.add('inventions');
  }

  addEventListeners() {
    this.idealistEl.addEventListener('click', (e) => {
      if (e.target.classList.contains('fa-times')) {
        e.stopImmediatePropagation();

        const ideaId = e.target.parentElement.parentElement.dataset.id;

        this.deleteIdea(ideaId);
      }
    });
  }

  async getIdeas() {
    try {
      const res = await IdeasApi.getIdeas();
      this._ideas = res.data.data;
      this.render();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteIdea(ideaId) {
    try {
      const res = await IdeasApi.deleteIdea(ideaId);
      this._ideas.filter((idea) => idea.id !== ideaId);
      this.getIdeas();
    } catch (error) {
      alert('You cannot delete this resource');
    }
  }

  addIdeaToList(idea) {
    this._ideas.push(idea);
    this.render();
  }

  getTagClass(tag) {
    tag = tag.toLowerCase();
    let tagClass = '';
    if (this._validTags.has(tag)) {
      tagClass = `tag-${tag}`;
    } else {
      tagClass = '';
    }

    return tagClass;
  }

  render() {
    this.idealistEl.innerHTML = this._ideas
      .map((idea) => {
        const tagClass = this.getTagClass(idea.tag);
        const deletBtn =
          localStorage.getItem('username') === idea.username
            ? ` <button class="delete"><i class="fas fa-times"></i></button>`
            : '';
        return `
         <div class="card" data-id="${idea._id}" >
         ${deletBtn}
          <h3>
            ${idea.text}
          </h3>
          <p class="tag ${tagClass}">${idea.tag}</p>
          <p>
            Posted on <span class="date">January 1, 2022</span> by
            <span class="author">${idea.username}</span>
          </p>
        </div>
      `;
      })
      .join('');

    this.addEventListeners();
  }
}

export default IdeaList;
