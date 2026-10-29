const express = require('express');
const cors = require('cors');
const ExcelJS = require("exceljs");
const { PrismaClient } = require('@prisma/client');
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const prisma = new PrismaClient();

const upload = multer({
  dest: "uploads/",
});

//Helper function to parse followers from string to number
function parseFollowers(value) {

  if (
    value === null ||
    value === undefined ||
    value === "" ||
    Number.isNaN(value)
  ) {
    return null;
  }
  if (typeof value === "number") {
    return value;
  }
  let str = String(value)
    .trim()
    .replace(/,/g, "");

  const lower = str.toLowerCase();

  if (lower.endsWith("k")) {
    const numberPart = parseFloat(
      lower.replace("k", "")
    );

    return Number.isNaN(numberPart)
      ? null
      : Math.round(numberPart * 1000);
  }

  if (lower.endsWith("m")) {
    const numberPart = parseFloat(
      lower.replace("m", "")
    );

    return Number.isNaN(numberPart)
      ? null
      : Math.round(numberPart * 1000000);
  }

  const parsed = Number(str);

  return Number.isNaN(parsed)
    ? null
    : parsed;
}

// Helper function to determine the tier based on followers
function getTier(followers) {
  if (!followers || followers < 1000) {
    return null;
  }

  if (followers <= 10000) {
    return "Nano";
  }

  if (followers <= 100000) {
    return "Micro";
  }

  if (followers <= 500000) {
    return "Mid_Tier";
  }

  if (followers <= 1000000) {
    return "Macro";
  }

  return "Mega";
}

//String conversion helper function
function toStringValue(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (typeof value === "object") {

    if (
      typeof value.text === "string"
    ) {

      if (
        value.text.includes("<a ") ||
        value.text.includes("</a>")
      ) {
        return "[INVALID_HTML]";
      }

      return value.text.trim();
    }

    if (
      typeof value.hyperlink === "string"
    ) {

      if (
        value.hyperlink.includes("<a ") ||
        value.hyperlink.includes("</a>")
      ) {
        return "[INVALID_HTML]";
      }

      return value.hyperlink.trim();
    }

    return "[INVALID_OBJECT]";
  }

  return String(value).trim();
}

// Helper function to format followers for display
function formatFollowers(count) {
  if (!count) {
    return "";
  }

  if (count >= 1000000) {
    const value = count / 1000000;

    return `${parseFloat(
      value.toFixed(1)
    )}M`;
  }

  if (count >= 1000) {
    const value = count / 1000;

    return `${parseFloat(
      value.toFixed(1)
    )}K`;
  }

  return count.toString();
}

// Social media handle normalization functions
function normalizeInstagram(value) {
  if (!value) return null;

  const input = value.trim();

  if (
    input.startsWith("http://") ||
    input.startsWith("https://")
  ) {
    const match = input.match(
      /instagram\.com\/([^/?#]+)/i
    );

    if (!match) {
      return input;
    }

    return `https://www.instagram.com/${match[1]}/`;
  }

  const handle = input.startsWith("@")
    ? input.substring(1)
    : input;

  return `https://www.instagram.com/${handle}/`;
}

function normalizeFacebook(value) {
  if (!value) return null;

  const input = value.trim();

  if (
    input.startsWith("http://") ||
    input.startsWith("https://")
  ) {
    const match = input.match(
      /facebook\.com\/([^/?#]+)/i
    );

    if (!match) {
      return input;
    }

    return `https://www.facebook.com/${match[1]}/`;
  }

  const handle = input.startsWith("@")
    ? input.substring(1)
    : input;

  return `https://www.facebook.com/${handle}/`;
}

function normalizeTikTok(value) {
  if (!value) return null;

  const input = value.trim();

  if (
    input.startsWith("http://") ||
    input.startsWith("https://")
  ) {
    const match = input.match(
      /tiktok\.com\/@?([^/?#]+)/i
    );

    if (!match) {
      return input;
    }

    return `https://www.tiktok.com/@${match[1]}/`;
  }

  const handle = input.startsWith("@")
    ? input.substring(1)
    : input;

  return `https://www.tiktok.com/@${handle}/`;
}

// Allow requests from your React app
app.use(cors());

// Allow the server to read JSON request bodies
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

//Excel Import Template route
app.get("/entries/template", async (req, res) => {
  const workbook = new ExcelJS.Workbook();

  const worksheet =
    workbook.addWorksheet("Influencers");

  worksheet.columns = [
    { header: "nombre", key: "nombre" },
    {
      header: "tituloCanal",
      key: "tituloCanal",
    },
    { header: "agencia", key: "agencia" },
    { header: "telefono", key: "telefono" },
    { header: "email", key: "email" },
    { header: "direccion", key: "direccion" },
    {
      header: "notas",
      key: "notas",
    },

    {
      header: "categorias",
      key: "categorias",
    },

    { header: "handleIg", key: "handleIg" },
    {
      header: "seguidoresIg",
      key: "seguidoresIg",
    },

    { header: "handleFb", key: "handleFb" },
    {
      header: "seguidoresFb",
      key: "seguidoresFb",
    },

    { header: "handleTt", key: "handleTt" },
    {
      header: "seguidoresTt",
      key: "seguidoresTt",
    },
  ];

  worksheet.addRow({
    nombre: "Carlos Test",
    tituloCanal: "Canal Test",
    agencia: "Arco Publicidad",
    telefono: "7875551234",
    email: "correo@test.com",
    direccion: "San Juan",

    categorias: "Foodie, Turismo",

    handleIg: "@carlosig",
    seguidoresIg: 15000,

    handleFb: "@carlosfb",
    seguidoresFb: 8000,

    handleTt: "@carlostt",
    seguidoresTt: 25000,
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=Influencer_Template.xlsx"
  );

  await workbook.xlsx.write(res);

  res.end();
});

//Excel Import route
app.post(
  "/entries/import",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No file uploaded",
        });
      }

      const extension = path.extname(
        req.file.originalname
      ).toLowerCase();

      let rows = [];

      if (extension === ".xlsx") {
        const workbook = new ExcelJS.Workbook();

        await workbook.xlsx.readFile(
          req.file.path
        );

        const worksheet =
          workbook.worksheets[0];

        const headers = [];

        worksheet.getRow(1).eachCell(
          (cell, columnNumber) => {
            headers[columnNumber] =
              cell.value;
          }
        );

        worksheet.eachRow(
          (row, rowNumber) => {
            if (rowNumber === 1) {
              return;
            }

            const rowData = {};

            row.eachCell(
              (cell, columnNumber) => {
                rowData[
                  headers[columnNumber]
                ] = cell.value;
              }
            );

            rows.push(rowData);
          }
        );
      }
      else if (extension === ".csv") {
        rows = await new Promise(
          (resolve, reject) => {
            const results = [];

            fs.createReadStream(req.file.path)
              .pipe(csv())
              .on("data", (data) =>
                results.push(data)
              )
              .on("end", () =>
                resolve(results)
              )
              .on("error", reject);
          }
        );
      }

      else {
        return res.status(400).json({
          error:
            "Only .xlsx and .csv files are supported",
        });
      }
      let importedCount = 0;
      let errorCount = 0;

      const errors = [];
      const duplicates = [];

      for (const [index, row] of rows.entries()) {
        try {
          const seguidoresIg =
            parseFollowers(
              row.seguidoresIg
            );
          console.log("IG RESULT", seguidoresIg);

          if (
            row.seguidoresIg &&
            seguidoresIg == null
          ) {
            errorCount++;

            errors.push({
              row: index + 2,
              message:
                `Valor de seguidores de Instagram inválido (${toStringValue(row.seguidoresIg)})`,
            });

            continue;
          }

          const seguidoresFb =
            parseFollowers(
              row.seguidoresFb
            );
          console.log("FB RESULT", seguidoresFb);
          if (
            row.seguidoresFb &&
            seguidoresFb == null
          ) {
            errorCount++;

            errors.push({
              row: index + 2,
              message:
                `Valor de seguidores de Facebook inválido (${toStringValue(row.seguidoresFb)})`,
            });

            continue;
          }

          const seguidoresTt =
            parseFollowers(
              row.seguidoresTt
            );
          console.log("TT RESULT", seguidoresTt);
          if (
            row.seguidoresTt &&
            seguidoresTt == null
          ) {
            errorCount++;

            errors.push({
              row: index + 2,
              message:
                `Valor de seguidores de TikTok inválido (${toStringValue(row.seguidoresTt)})`,
            });

            continue;
          }

          if (!toStringValue(row.nombre)) {
            errorCount++;

            errors.push({
              row: index + 2,
              message: "Nombre es requerido",
            });

            continue;
          }
          if (!toStringValue(row.tituloCanal)) {
            errorCount++;

            errors.push({
              row: index + 2,
              message: "Título del Canal es requerido",
            });

            continue;
          }

          const categoryNames =
            toStringValue(row.categorias)
              .split(/\s*(?:,|&|and|\/|\|)\s*/i)
              .map((c) => c.trim())
              .filter(Boolean);

          const matchingCategories = await prisma.category.findMany({
            where: {
              name: {
                in: categoryNames,
              },
            },
          });

          if (
            categoryNames.length > 0 &&
            matchingCategories.length !== categoryNames.length
          ) {
            errorCount++;

            errors.push({
              row: index + 2,
              message:
                `Categoría inválida o no existente en base de datos: ${toStringValue(row.categorias)}`,
            });

            continue;
          }

          const normalizedHandleIg =
            toStringValue(row.handleIg)
              ?.trim()
              .toLowerCase();

          const normalizedHandleFb =
            toStringValue(row.handleFb)
              ?.trim()
              .toLowerCase();

          const normalizedHandleTt =
            toStringValue(row.handleTt)
              ?.trim()
              .toLowerCase();

          const normalizedEmail =
            toStringValue(row.email)
              ?.trim()
              .toLowerCase();

          const normalizedNombre =
            toStringValue(row.nombre)
              ?.trim()
              .toLowerCase();

          const normalizedTituloCanal =
            toStringValue(row.tituloCanal)
              ?.trim()
              .toLowerCase();

          const fieldsToValidate = [
            row.email,
            row.handleIg,
            row.handleFb,
            row.handleTt,
          ];

          const hasInvalidData =
            fieldsToValidate.some(
              (value) => {
                const converted =
                  toStringValue(value);

                return (
                  converted ===
                  "[INVALID_OBJECT]" ||
                  converted ===
                  "[INVALID_HTML]"
                );
              }
            );
          if (hasInvalidData) {
            errorCount++;

            errors.push({
              row: index + 2,
              message:
                "El archivo contiene un email o handle con formato incompatible.",
            });

            continue;
          }

          const duplicateConditions = [];
          if (normalizedHandleIg) {
            duplicateConditions.push({
              handleIg: normalizedHandleIg,
            });
          }

          if (normalizedHandleFb) {
            duplicateConditions.push({
              handleFb: normalizedHandleFb,
            });
          }

          if (normalizedHandleTt) {
            duplicateConditions.push({
              handleTt: normalizedHandleTt,
            });
          }

          if (normalizedEmail) {
            duplicateConditions.push({
              email: normalizedEmail,
            });
          }

          if (normalizedNombre) {
            duplicateConditions.push({
              nombre: normalizedNombre,
            });
          }

          if (normalizedTituloCanal) {
            duplicateConditions.push({
              tituloCanal:
                normalizedTituloCanal,
            });
          }

          let existingInfluencer = null;

          if (duplicateConditions.length > 0) {
            existingInfluencer =
              await prisma.entry.findFirst({
                where: {
                  OR: duplicateConditions,
                },
              });
          }

          if (
            !existingInfluencer &&
            normalizedNombre &&
            normalizedTituloCanal
          ) {
            const potentialMatches =
              await prisma.entry.findMany();

            existingInfluencer =
              potentialMatches.find(
                (entry) =>
                  entry.nombre
                    ?.trim()
                    .toLowerCase() ===
                  normalizedNombre &&
                  entry.tituloCanal
                    ?.trim()
                    .toLowerCase() ===
                  normalizedTituloCanal
              );
          }

          if (existingInfluencer) {

            let duplicateField =
              "existing record";

            if (
              existingInfluencer.handleIg &&
              existingInfluencer.handleIg ===
              toStringValue(row.handleIg)
            ) {
              duplicateField =
                `Instagram Handle (${toStringValue(row.handleIg)})`;
            }

            else if (
              existingInfluencer.handleFb &&
              existingInfluencer.handleFb ===
              toStringValue(row.handleFb)
            ) {
              duplicateField =
                `Facebook Handle (${toStringValue(row.handleFb)})`;
            }

            else if (
              existingInfluencer.handleTt &&
              existingInfluencer.handleTt ===
              toStringValue(row.handleTt)
            ) {
              duplicateField =
                `TikTok Handle (${toStringValue(row.handleTt)})`;
            }

            else if (
              existingInfluencer.email &&
              existingInfluencer.email ===
              toStringValue(row.email)
            ) {
              duplicateField =
                `Email (${toStringValue(row.email)})`;
            }

            else if (
              existingInfluencer.nombre
                ?.toLowerCase() ===
              normalizedNombre &&
              existingInfluencer.tituloCanal
                ?.toLowerCase() ===
              normalizedTituloCanal
            ) {
              duplicateField =
                `Nombre + Título Canal (${toStringValue(row.nombre)} / ${toStringValue(row.tituloCanal)})`;
            }

            else if (
              existingInfluencer.nombre
                ?.trim()
                .toLowerCase() ===
              normalizedNombre &&
              existingInfluencer.tituloCanal
                ?.trim()
                .toLowerCase() ===
              normalizedTituloCanal
            ) {
              duplicateField =
                `Nombre + Título Canal (${row.nombre} / ${row.tituloCanal})`;
            }

            duplicates.push({
              row: index + 2,
              message:
                `Duplicate ${duplicateField}`,
            });

            continue;
          }

          await prisma.entry.create({
            data: {
              nombre: toStringValue(row.nombre),

              tituloCanal:
                toStringValue(row.tituloCanal),

              agencia:
                toStringValue(row.agencia),

              telefono:
                toStringValue(row.telefono),

              email:
                toStringValue(row.email),

              direccion:
                toStringValue(row.direccion),

              notas:
                toStringValue(row.notas),

              handleIg:
                normalizeInstagram(toStringValue(row.handleIg)),

              seguidoresIg,

              tierIg:
                getTier(seguidoresIg),

              handleFb:
                normalizeFacebook(toStringValue(row.handleFb)),

              seguidoresFb,

              tierFb:
                getTier(seguidoresFb),

              handleTt:
                normalizeTikTok(toStringValue(row.handleTt)),

              seguidoresTt,

              tierTt:
                getTier(seguidoresTt),

              categoria: {
                connect:
                  matchingCategories.map(
                    (cat) => ({
                      id: cat.id,
                    })
                  ),
              },
            },
          });

          importedCount++;
        } catch (error) {
          errorCount++;

          errors.push({
            row: index + 2,
            message: error.message,
          });
        }
      }

      fs.unlinkSync(req.file.path);

      res.json({
        importedCount,
        duplicateCount:
          duplicates.length,
        errorCount:
          errors.length,
        duplicates,
        errors,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Import failed",
      });
    }
  }
);

//Excel Export route
app.post("/entries/export", async (req, res) => {
  try {
    const influencers = req.body;

    const workbook = new ExcelJS.Workbook();

    const worksheet =
      workbook.addWorksheet("Influencers");

    worksheet.columns = [
      { header: "Nombre", key: "nombre" },
      {
        header: "Titulo Canal",
        key: "tituloCanal",
      },
      { header: "Agencia", key: "agencia" },
      { header: "Telefono", key: "telefono" },
      { header: "Email", key: "email" },
      { header: "Direccion", key: "direccion" },
      {
        header: "Notas",
        key: "notas",
      },

      {
        header: "Categorias",
        key: "categorias",
      },

      {
        header: "Instagram",
        key: "handleIg",
      },
      {
        header: "Seguidores IG",
        key: "seguidoresIg",
      },
      {
        header: "Tier IG",
        key: "tierIg",
      },

      {
        header: "Facebook",
        key: "handleFb",
      },
      {
        header: "Seguidores FB",
        key: "seguidoresFb",
      },
      {
        header: "Tier FB",
        key: "tierFb",
      },

      {
        header: "TikTok",
        key: "handleTt",
      },
      {
        header: "Seguidores TT",
        key: "seguidoresTt",
      },
      {
        header: "Tier TT",
        key: "tierTt",
      },
    ];
    influencers.forEach((influencer) => {
      worksheet.addRow({
        nombre: influencer.nombre,

        tituloCanal:
          influencer.tituloCanal,

        agencia: influencer.agencia,

        telefono:
          influencer.telefono,

        email: influencer.email,

        direccion:
          influencer.direccion,

        notas:
          influencer.notas,

        categorias:
          influencer.categoria
            ?.map((c) => c.name)
            .join(", "),

        handleIg:
          influencer.handleIg,

        seguidoresIg:
          formatFollowers(
            influencer.seguidoresIg
          ),

        tierIg:
          influencer.tierIg,

        handleFb:
          influencer.handleFb,

        seguidoresFb:
          formatFollowers(
            influencer.seguidoresFb
          ),

        tierFb:
          influencer.tierFb,

        handleTt:
          influencer.handleTt,

        seguidoresTt:
          formatFollowers(
            influencer.seguidoresTt
          ),

        tierTt:
          influencer.tierTt,
      });
    });
    const headerRow = worksheet.getRow(1);

    headerRow.font = {
      bold: true,
    };

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "D9EAF7",
        },
      };
    });

    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    worksheet.autoFilter = {
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: 1,
        column: worksheet.columnCount,
      },
    };

    worksheet.columns.forEach((column) => {
      let maxLength = column.header.length;

      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value
          ? cell.value.toString()
          : "";

        if (cellValue.length > maxLength) {
          maxLength = cellValue.length;
        }
      });

      column.width = Math.min(
        Math.max(maxLength + 2, 15),
        50
      );
    });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Influencers_Export.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Export failed",
    });
  }
});

//Get categories route
app.get("/categories", async (req, res) => {
  try {
    const categories =
      await prisma.category.findMany({
        include: {
          entries: true,
        },
        orderBy: {
          name: "asc",
        },
      });

    res.json(categories);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch categories",
    });
  }
});

//Create category route
app.post("/categories", async (req, res) => {
  try {
    const { name } = req.body;

    const category =
      await prisma.category.create({
        data: {
          name,
        },
      });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create category",
    });
  }
});

//Update category route
app.put("/categories/:id", async (req, res) => {
  try {
    const { name } = req.body;

    const category =
      await prisma.category.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          name,
        },
      });

    res.json(category);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update category",
    });
  }
});

//Delete category route
app.delete("/categories/:id", async (req, res) => {
  try {
    const category =
      await prisma.category.findUnique({
        where: {
          id: Number(req.params.id),
        },
        include: {
          entries: true,
        },
      });
    if (!category) {
      return res.status(404).json({
        error: "Category not found",
      });
    }
    if (category.entries.length > 0) {
      return res.status(400).json({
        error:
          `No se puede eliminar esta categoría porque está asociada a ${category.entries.length} influencer(s).`,
      });
    }
    await prisma.category.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      message:
        "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete category",
    });
  }
});


//Get all entries route
app.get('/entries', async (req, res) => {
  try {
    const entries = await prisma.entry.findMany({
      include: {
        categoria: true, // include categories in the response
      },
    });
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

//Delete entry route
app.delete('/entries/:id', async (req, res) => {
  try {
    const deletedEntry = await prisma.entry.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json(deletedEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to delete entry',
    });
  }
});

//get all categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

//GET details route
app.get('/entries/:id', async (req, res) => {
  try {
    const entry = await prisma.entry.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        categoria: true,
      },
    });

    res.json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to fetch entry',
    });
  }
});


//POST create a new category
app.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;

    const category = await prisma.category.create({
      data: { name },
    });

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Seed categories route
app.get('/seed-categories', async (req, res) => {
  try {
    const categories = [
      'Foodie',
      'Mascotas',
      'Hogar',
      'Lifestyle',
      'Familiar',
      'Juvenil',
      'Comedia',
      'Profesional de Salud',
      'Turismo',
      'Beauty and Wellness',
      'Viaje',
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { name: category },
        update: {},
        create: {
          name: category,
        },
      });
    }

    res.json({ message: 'Categories seeded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to seed categories' });
  }
});

//POST create a new Entry (with categories)
app.post('/entries', async (req, res) => {
  try {
    const {
      nombre,
      tituloCanal,
      agencia,
      telefono,
      email,
      direccion,
      notas,
      categoriaIds,   // array of category IDs
      handleFb,
      seguidoresFb,
      tierFb,
      handleIg,
      seguidoresIg,
      tierIg,
      handleTt,
      seguidoresTt,
      tierTt,
    } = req.body;

    const parsedSeguidoresFb = seguidoresFb === "" ? null : Number(seguidoresFb);
    const parsedSeguidoresIg = seguidoresIg === "" ? null : Number(seguidoresIg);
    const parsedSeguidoresTt = seguidoresTt === "" ? null : Number(seguidoresTt);
    const getTier = (followers) => {
      if (!followers || followers < 1000) {
        return null;
      }

      if (followers <= 10000) {
        return "Nano";
      }

      if (followers <= 100000) {
        return "Micro";
      }

      if (followers <= 500000) {
        return "Mid_Tier";
      }

      if (followers <= 1000000) {
        return "Macro";
      }

      return "Mega";
    };

    const calculatedTierFb =
      getTier(parsedSeguidoresFb);

    const calculatedTierIg =
      getTier(parsedSeguidoresIg);

    const calculatedTierTt =
      getTier(parsedSeguidoresTt);

    const entry = await prisma.entry.create({
      data: {
        nombre,
        tituloCanal,
        agencia,
        telefono,
        email,
        direccion,
        notas,

        categoria: {
          connect: categoriaIds?.map(id => ({ id })) || [],
        },

        handleFb,
        seguidoresFb: parsedSeguidoresFb,
        tierFb: calculatedTierFb,

        handleIg,
        seguidoresIg: parsedSeguidoresIg,
        tierIg: calculatedTierIg,

        handleTt,
        seguidoresTt: parsedSeguidoresTt,
        tierTt: calculatedTierTt,
      },
      include: {
        categoria: true,
      },
    });

    res.json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

//UPDATE an entry (including categories)
app.put('/entries/:id', async (req, res) => {
  try {
    const {
      nombre,
      tituloCanal,
      agencia,
      telefono,
      email,
      direccion,
      notas,
      categoriaIds,
      handleFb,
      seguidoresFb,
      handleIg,
      seguidoresIg,
      handleTt,
      seguidoresTt,
    } = req.body;

    const parsedSeguidoresFb =
      seguidoresFb === "" ? null : Number(seguidoresFb);

    const parsedSeguidoresIg =
      seguidoresIg === "" ? null : Number(seguidoresIg);

    const parsedSeguidoresTt =
      seguidoresTt === "" ? null : Number(seguidoresTt);

    const getTier = (followers) => {
      if (!followers || followers < 1000) return null;
      if (followers <= 10000) return "Nano";
      if (followers <= 100000) return "Micro";
      if (followers <= 500000) return "Mid_Tier";
      if (followers <= 1000000) return "Macro";
      return "Mega";
    };

    const updatedEntry = await prisma.entry.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        nombre,
        tituloCanal,
        agencia,
        telefono,
        email,
        direccion,
        notas,

        handleFb,
        seguidoresFb: parsedSeguidoresFb,
        tierFb: getTier(parsedSeguidoresFb),

        handleIg,
        seguidoresIg: parsedSeguidoresIg,
        tierIg: getTier(parsedSeguidoresIg),

        handleTt,
        seguidoresTt: parsedSeguidoresTt,
        tierTt: getTier(parsedSeguidoresTt),

        categoria: {
          set: [],
          connect:
            categoriaIds?.map((id) => ({
              id,
            })) || [],
        },
      },
      include: {
        categoria: true,
      },
    });

    res.json(updatedEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to update entry",
    });
  }
});

//GET a single Entry
app.get('/entries/:id', async (req, res) => {
  try {
    const entry = await prisma.entry.findUnique({
      where: { id: Number(req.params.id) },
      include: { categoria: true },
    });

    if (!entry) return res.status(404).json({ error: 'Entry not found' });

    res.json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch entry' });
  }
});


//PUT update an entry (including categories)
app.put('/entries/:id', async (req, res) => {
  try {
    const {
      nombre,
      tituloCanal,
      agencia,
      telefono,
      email,
      direccion,
      notas,
      categoriaIds,
      handleFb,
      seguidoresFb,
      tierFb,
      handleIg,
      seguidoresIg,
      tierIg,
      handleTt,
      seguidoresTt,
      tierTt,
    } = req.body;

    const entry = await prisma.entry.update({
      where: { id: Number(req.params.id) },
      data: {
        nombre,
        tituloCanal,
        agencia,
        telefono,
        email,
        direccion,
        notas,

        categoria: {
          set: categoriaIds?.map(id => ({ id })) || [],
        },

        handleFb,
        seguidoresFb,
        tierFb,

        handleIg,
        seguidoresIg,
        tierIg,

        handleTt,
        seguidoresTt,
        tierTt,
      },
      include: { categoria: true },
    });

    res.json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

//DELETE an entry
app.delete('/entries/:id', async (req, res) => {
  try {
    await prisma.entry.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ message: 'Entry deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

//DELETE a category
app.delete('/categories/:id', async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});


// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});