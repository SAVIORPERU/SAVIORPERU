-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agencia" (
    "id" SERIAL NOT NULL,
    "agencias" TEXT[],
    "minimoDelivery" INTEGER NOT NULL DEFAULT 10,
    "maximoDelivery" INTEGER NOT NULL DEFAULT 15,

    CONSTRAINT "Agencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coleccion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Coleccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cupon" (
    "id" SERIAL NOT NULL,
    "codigoCupon" TEXT NOT NULL DEFAULT 'qwer',
    "mostrarCupon" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Cupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fotos" (
    "id" SERIAL NOT NULL,
    "imagenIzquierda" TEXT NOT NULL,
    "imagenDerecha" TEXT NOT NULL,
    "fotoTienda" TEXT NOT NULL,

    CONSTRAINT "Fotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Productos" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "image2" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductosDestacados" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,

    CONSTRAINT "ProductosDestacados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProductosDestacados_productoId_key" ON "ProductosDestacados"("productoId");

-- AddForeignKey
ALTER TABLE "ProductosDestacados" ADD CONSTRAINT "ProductosDestacados_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
