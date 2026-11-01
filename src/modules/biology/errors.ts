export class UnsupportedBiologicalProfile extends Error {
  constructor() {
    super(
      "Perfil biológico ou versão não suportados. Preserve o arquivo original para uma versão compatível.",
    );
    this.name = "UnsupportedBiologicalProfile";
  }
}
