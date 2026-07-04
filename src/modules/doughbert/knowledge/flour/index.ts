import { t65KnowledgeBite } from "./t65";
import { t80KnowledgeBite } from "./t80";
import { t110KnowledgeBite } from "./t110";
import { t130KnowledgeBite } from "./t130";
import { t150KnowledgeBite } from "./t150";
import { patentbloemKnowledgeBite } from "./patentbloem";
import { tarwebloemKnowledgeBite } from "./tarwebloem";
import { volkorenmeelKnowledgeBite } from "./volkorenmeel";
import { roggeKnowledgeBite } from "./rogge";
import { speltKnowledgeBite } from "./spelt";
import { tipo00KnowledgeBite } from "./tipo-00";
import { semolaRimacinataKnowledgeBite } from "./semola-rimacinata";

import { definitionToArticleInput } from "../import/articleNormalizer";
import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";

/** All flour articles — add new meelsoorten here, not in a central registry. */
export const flourArticles: KnowledgeArticleInput[] = [
  definitionToArticleInput(t65KnowledgeBite),
  definitionToArticleInput(t80KnowledgeBite),
  definitionToArticleInput(t110KnowledgeBite),
  definitionToArticleInput(t130KnowledgeBite),
  definitionToArticleInput(t150KnowledgeBite),
  definitionToArticleInput(patentbloemKnowledgeBite),
  definitionToArticleInput(tarwebloemKnowledgeBite),
  definitionToArticleInput(volkorenmeelKnowledgeBite),
  definitionToArticleInput(roggeKnowledgeBite),
  definitionToArticleInput(speltKnowledgeBite),
  definitionToArticleInput(tipo00KnowledgeBite),
  definitionToArticleInput(semolaRimacinataKnowledgeBite),
];
