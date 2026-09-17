import {
	BorderStyle,
	Document,
	HeadingLevel,
	HighlightColor,
	LeaderType,
	LineRuleType,
	Packer,
	PageOrientation,
	Paragraph,
	Tab,
	TabStopType,
	Table,
	TableBorders,
	TableCell,
	TableLayoutType,
	TableRow,
	TextRun,
	WidthType,
	convertInchesToTwip,
	type FileChild,
	type ITableCellBorders,
	type ParagraphChild
} from 'docx';
import {
	getContractTitle,
	type ResolvedContractDocument,
	type ResolvedBlockNode,
	type ResolvedTextNode
} from '../../../contract/resolve.ts';
import type {
	SignatureFieldNode,
	SignatureGridNode,
	SignaturePartyNode,
	TextNode
} from '../../../contract/types.ts';

export const DOCX_MIME_TYPE =
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const CONTENT_WIDTH = convertInchesToTwip(6.5);
const SIGNATURE_COLUMN_WIDTH = CONTENT_WIDTH / 2;
const SIGNATURE_GAP = convertInchesToTwip(0.28);
const SIGNATURE_LINE_END = SIGNATURE_COLUMN_WIDTH - SIGNATURE_GAP / 2;
const NO_CELL_BORDERS = {
	top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
	bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
	left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
	right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
} as const satisfies ITableCellBorders;

function textRun(node: TextNode, revisionState?: ResolvedTextNode['revisionState']): TextRun {
	return new TextRun({
		text: node.value,
		bold: node.marks?.bold,
		italics: node.marks?.italic,
		...(revisionState === 'inactive' ? { color: '5F6368', strike: true } : {}),
		...(revisionState === 'proposed' ? { highlight: HighlightColor.YELLOW } : {})
	});
}

function inlineRuns(nodes: ResolvedTextNode[]): ParagraphChild[] {
	return nodes.map((node) => textRun(node, node.revisionState));
}

function headingLevel(level: 1 | 2 | 3) {
	if (level === 1) return HeadingLevel.HEADING_1;
	if (level === 2) return HeadingLevel.HEADING_2;
	return HeadingLevel.HEADING_3;
}

function signatureField(field: SignatureFieldNode): Paragraph {
	const children: ParagraphChild[] = [new TextRun(`${field.label}: `)];

	if (field.kind === 'signature-line') {
		children.push(new TextRun({ children: [new Tab()] }));
	} else {
		children.push(
			new TextRun({
				text: field.value ?? '',
				bold: field.marks?.bold,
				italics: field.marks?.italic
			})
		);
	}

	return new Paragraph({
		children,
		...(field.kind === 'signature-line'
			? {
					tabStops: [
						{
							type: TabStopType.RIGHT,
							position: SIGNATURE_LINE_END,
							leader: LeaderType.UNDERSCORE
						}
					]
				}
			: {}),
		spacing: { after: 210, line: 350, lineRule: LineRuleType.AUTO },
		widowControl: true
	});
}

function signaturePartyCell(
	party: SignaturePartyNode,
	position: 'left' | 'right'
): TableCell {
	return new TableCell({
		width: { size: SIGNATURE_COLUMN_WIDTH, type: WidthType.DXA },
		borders: NO_CELL_BORDERS,
		margins: {
			top: 0,
			bottom: 0,
			left: position === 'right' ? SIGNATURE_GAP / 2 : 0,
			right: position === 'left' ? SIGNATURE_GAP / 2 : 0
		},
		children: [
			new Paragraph({
				children: [new TextRun({ text: party.name, bold: true })],
				spacing: { after: 390 },
				keepNext: true
			}),
			...party.fields.map(signatureField)
		]
	});
}

function signatureBlock(block: SignatureGridNode): FileChild[] {
	const [leftParty, rightParty] = block.parties;

	return [
		new Paragraph({
			children: [new TextRun(block.title)],
			heading: HeadingLevel.HEADING_2,
			spacing: { before: 720, after: 450 },
			keepNext: true,
			keepLines: true
		}),
		new Table({
			width: { size: CONTENT_WIDTH, type: WidthType.DXA },
			columnWidths: [SIGNATURE_COLUMN_WIDTH, SIGNATURE_COLUMN_WIDTH],
			layout: TableLayoutType.FIXED,
			borders: TableBorders.NONE,
			rows: [
				new TableRow({
					cantSplit: true,
					children: [
						signaturePartyCell(leftParty, 'left'),
						signaturePartyCell(rightParty, 'right')
					]
				})
			]
		})
	];
}

function blockChildren(block: ResolvedBlockNode): FileChild[] {
	if (block.type === 'signature-grid') return signatureBlock(block);

	if (block.type === 'heading') {
		return [
			new Paragraph({
				children: inlineRuns(block.content),
				heading: headingLevel(block.level),
				keepNext: true,
				keepLines: true,
				widowControl: true
			})
		];
	}

	return [
		new Paragraph({
			children: inlineRuns(block.content),
			widowControl: true
		})
	];
}

function createContractDocxDocument(document: ResolvedContractDocument): Document {
	const title = getContractTitle(document);

	return new Document({
		title,
		subject: title,
		creator: 'Agreed',
		description: 'Contract exported from Agreed.',
		styles: {
			default: {
				document: {
					run: { font: 'Arial', size: 24 },
					paragraph: {
						spacing: { after: 300, line: 350, lineRule: LineRuleType.AUTO }
					}
				},
				heading1: {
					run: { font: 'Arial', size: 41, bold: true, color: '171717' },
					paragraph: { spacing: { before: 0, after: 420 }, keepNext: true, keepLines: true }
				},
				heading2: {
					run: { font: 'Arial', size: 33, bold: true, color: '171717' },
					paragraph: { spacing: { before: 510, after: 270 }, keepNext: true, keepLines: true }
				},
				heading3: {
					run: { font: 'Arial', size: 24, bold: true, color: '171717' },
					paragraph: { spacing: { before: 0, after: 390 }, keepNext: true, keepLines: true }
				}
			}
		},
		sections: [
			{
				properties: {
					page: {
						size: {
							width: convertInchesToTwip(8.5),
							height: convertInchesToTwip(11),
							orientation: PageOrientation.PORTRAIT
						},
						margin: {
							top: convertInchesToTwip(1),
							right: convertInchesToTwip(1),
							bottom: convertInchesToTwip(1),
							left: convertInchesToTwip(1)
						}
					}
				},
				children: document.blocks.flatMap(blockChildren)
			}
		]
	});
}

export async function createContractDocx(
	document: ResolvedContractDocument
): Promise<Blob> {
	const blob = await Packer.toBlob(createContractDocxDocument(document));
	if (blob.type === DOCX_MIME_TYPE) return blob;
	return new Blob([blob], { type: DOCX_MIME_TYPE });
}
