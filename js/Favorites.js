import { GitfavUser } from "./GitfavUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@gitfav:")) || [];
  }

  save() {
    localStorage.setItem("@gitfav:", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find(
        (entry) => entry.login.toLowerCase() === username.toLowerCase()
      );

      if (userExists) {
        throw new Error("User already exists");
      }

      const user = await GitfavUser.search(username);

      if (user.login === undefined) {
        throw new Error("User not found");
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filterEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filterEntries;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onAdd();
  }

  onAdd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");

      this.add(value);
    };
  }

  update() {

    this.tableUsersEmpty();

    this.removeAlltr();

      this.entries.forEach((user) => {
        const row = this.createRow();
  
        row.querySelector(
          ".user img"
        ).src = `https://github.com/${user.login}.png`;
        row.querySelector(".user img").alt = `Foto de perfil ${user.name}`;
        row.querySelector(".user a").href = `https://github.com/${user.login}`;
        row.querySelector(".user p").textContent = user.name;
        row.querySelector(".user span").textContent = user.login;
        row.querySelector(".repositories").textContent = user.public_repos;
        row.querySelector(".followers").textContent = user.followers;
  
        row.querySelector(".remove").onclick = () => {
          const isOk = confirm("Are you sure you want to remove?");
          if (isOk) {
            this.delete(user);
          }
        };
        this.tbody.append(row);
      });
    }

  tableUsersEmpty() {
    this.entries.length !== 0 ?
      document.querySelector('.star').classList.add('sr-only') :
      document.querySelector('.star').classList.remove('sr-only')
    }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td class="user">
    <img src="https://github.com/GabrielDevss.png" alt="Foto de perfil github">
    <a href="https://github.com/GabrielDevss" target="_blank">
      <p>Gabriel Olivera</p>
      <span>/gabrieldevss</span>
    </a>
  </td>
  <td class="repositories">123</td>
  <td class="followers">1234</td>
  <td class="remove">Remover</td>
    `;

    return tr;
  }

  removeAlltr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
