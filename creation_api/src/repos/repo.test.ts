// tests/repo.resolver.test.ts
import { RepoResolver } from "../repos/repo.resolvers";
import { describe, it, expect, jest } from "@jest/globals";

describe("RepoResolver - repos Query", () => {
  it("devrait renvoyer les repos avec les bonnes clés", async () => {
    const resolver = new RepoResolver();

    // Utiliser `Object.assign()` pour créer un objet du type `Repo`
    // const mockRepos: Repo[] = [
    //   Object.assign(new Repo(), {
    //     id: "1",
    //     name: "Test Repo",
    //     url: "https://github.com/test/repo",
    //     isPrivate: false,
    //     status: { label: "active" },
    //     langs: [{ id: 1, name: "JavaScript" }],
    //   }),
    // ];

    // On remplace la méthode `repos` pour qu'elle retourne les données mockées
    // jest.spyOn(resolver, "repos").mockResolvedValue(mockRepos);

    const repos = await resolver.repos();

    expect(repos).toBeInstanceOf(Array);

    // Vérifie les clés de la première entrée du tableau
    if (repos.length > 0) {
      const repo = repos[0];
      expect(repo).toHaveProperty("id");
      expect(repo).toHaveProperty("name");
      expect(repo).toHaveProperty("url");
      expect(repo).toHaveProperty("isPrivate");
      expect(repo).toHaveProperty("status");
      expect(repo).toHaveProperty("langs");
    } else {
      throw new Error(
        "La liste des repos est vide, impossible de vérifier les clés."
      );
    }
  });
});
