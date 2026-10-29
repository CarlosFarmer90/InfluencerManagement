-- CreateTable
CREATE TABLE "Entry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "tituloCanal" TEXT NOT NULL,
    "agencia" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "handleFb" TEXT,
    "seguidoresFb" INTEGER,
    "tierFb" TEXT,
    "handleIg" TEXT,
    "seguidoresIg" INTEGER,
    "tierIg" TEXT,
    "handleTt" TEXT,
    "seguidoresTt" INTEGER,
    "tierTt" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToEntry" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CategoryToEntry_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToEntry_B_fkey" FOREIGN KEY ("B") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToEntry_AB_unique" ON "_CategoryToEntry"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToEntry_B_index" ON "_CategoryToEntry"("B");
