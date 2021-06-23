export class Repository {
  constructor (item) {
    this.id = item.id
    this.name = item.name
    this.owner = item.owner.login
    this.stars = item.stargazers_count
  }

  static getRepoById (id, repositories) {
    const foundedRepo = repositories.find(repo => repo.id === Number(id))
    return new Repository(foundedRepo)
  }
}
