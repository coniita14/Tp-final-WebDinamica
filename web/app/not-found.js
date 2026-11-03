import Link from 'next/link';

export default function NoEncontrado() {
  return (
    <div className="pantalla-centro">
      <p className="emoji-grande" aria-hidden="true">🧉❓</p>
      <h1>No encontramos esa yerba</h1>
      <p>Puede que la hayan borrado o que el link esté mal.</p>
      <Link href="/" className="boton">Volver al listado</Link>
    </div>
  );
}
