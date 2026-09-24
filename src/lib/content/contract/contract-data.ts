import type { ContractDocument } from "$lib/document/types";

// Edit legal text here. TypeScript checks the document shape at build time.
export const contractDocument = {
  id: "oceans-xyz-professional-services-contract",
  blocks: [
    {
      type: "heading",
      content: [
        {
          type: "text",
          value: "OCEANS XYZ, LLC",
          marks: {
            bold: true,
          },
        },
      ],
      anchor: "oceans-xyz-llc",
      level: 1,
    },
    {
      type: "heading",
      anchor: "contract-section-1",
      level: 1,
      content: [
        {
          type: "text",
          value: "PROFESSIONAL SERVICES CONTRACT",
          marks: {
            bold: true,
          },
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: 'This Professional Services Contract (this "',
        },
        {
          type: "text",
          value: "Contract",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value: '"), effective as of ___________________________ (the "',
        },
        {
          type: "text",
          value: "Effective Date",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            '"), is by and between Oceans XYZ, LLC, a Delaware limited liability company ("',
        },
        {
          type: "text",
          value: "Provider",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value: '"), and ___________________________ ("',
        },
        {
          type: "text",
          value: "Customer",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            '"). Provider and Customer may be referred to herein collectively as the "',
        },
        {
          type: "text",
          value: "Parties",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value: '" or individually as a "',
        },
        {
          type: "text",
          value: "Party",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value: '."',
        },
      ],
    },
    {
      type: "heading",
      anchor: "contract-section-5",
      level: 2,
      content: [
        {
          type: "text",
          value: "RECITALS",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "WHEREAS, Customer desires to access the Services, and Provider desires to provide Customer access to the Services, subject to the terms and conditions of this Contract.",
        },
      ],
    },
    {
      type: "heading",
      anchor: "contract-section-9",
      level: 2,
      content: [
        {
          type: "text",
          value: "CONTRACT",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "NOW, THEREFORE, in consideration of the mutual covenants, terms, and conditions set forth herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:",
        },
      ],
    },
    {
      type: "heading",
      anchor: "contract-section-13",
      level: 2,
      content: [
        {
          type: "clause",
          id: "access-use",
          content: [
            {
              type: "text",
              value: "1. Access and Use.",
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "clause",
          id: "provision-professionals",
          content: [
            {
              type: "text",
              value: "(a) Provision of Professionals.",
            },
          ],
        },
        {
          type: "text",
          value:
            " Subject to and conditioned on Customer's payment of Fees and compliance with all the terms and conditions of this Contract, Provider hereby grants Customer a non-exclusive, non-transferable right to access and use the Services during the Term. Such use is limited to Customer's internal use only and Customer shall not use the Services of any Professional for the purpose of Customer’s delivery of any services to any third party (except as provided in Section 1(b) herein). “",
        },

        {
          type: "text",
          value: "Services",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            '" means certain services to be performed by Provider’s delegated professionals (each, a “',
        },
        {
          type: "text",
          value: "Professional",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            "”) described in the initial Statement of Work attached hereto as Exhibit A.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "clause",
          id: "resale",
          content: [
            {
              type: "text",
              value:
                "(b) Resale. Unless the Parties enter into Provider’s Resale Rider to the Professional Services Contract (the “",
            },
            {
              type: "text",
              value: "Resale Rider",
              marks: {
                bold: true,
                italic: true,
              },
            },
            {
              type: "text",
              value:
                '”), Customer’s right to and use of the Services and any Professional is personal and exclusive to Customer for Customer’s internal use only, and Customer expressly agrees not to resell any Services provided by any Professional to any third party, including any Sub-Customer (in each case, a "',
            },
            {
              type: "text",
              value: "Resale",
              marks: {
                bold: true,
                italic: true,
              },
            },
            {
              type: "text",
              value: "”). ",
            },
            {
              type: "provision",
              id: "resale-payment-restriction",
              content: [
                {
                  type: "text",
                  value:
                    "For the avoidance of doubt, Customer shall not receive any payment from any third party, including any Sub-Customer, for any Services provided by any Professional.",
                },
              ],
            },
            {
              type: "text",
              value:
                " In the event Customer wishes to commence any Resale, Customer shall provide a written request to Provider, which Provider may approve or deny in its sole discretion; provided, however, in the event Provider approves Customer’s request for Resale, such Resale shall be subject to the terms and conditions of the Resale Rider, which shall be executed by the Parties prior to the commencement of the Resale.",
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(c) Amendments to Statement of Work. The Parties agree that they will periodically review and reevaluate the Statement of Work and, if deemed necessary by the Parties, make amendments thereto. Any amendment to the Statement of Work will: (a) identify any updated Services and Fees (as defined in Section 3(a)), and (b) be executed in writing between the Parties. Notwithstanding the foregoing, the replacement of any Professional in accordance with Section 1(d) shall not require a written amendment to be executed by the Parties, and in lieu of such written amendment, the replacement request may be approved by Provider via e-mail and any approved replacement shall be subject to the terms and conditions of this Contract.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(d) Replacement of Professional.",
        },
        {
          type: "text",
          value: " ",
          marks: {
            bold: true,
          },
        },
        {
          type: "text",
          value:
            "If a Professional assigned to the Customer is unable to perform the Services under this Contract for a continuous period exceeding one (1) month, or if the Customer determines during the Initial Term (as defined below) that the Professional is not suitable for the role, then, upon written notice and detailed explanation from the Customer regarding the unsuitability of the Professional, the Provider will use its best efforts to provide the Customer with a reasonably suitable replacement Professional (the “",
        },
        {
          type: "text",
          value: "Replacement Professional",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            "”), as determined by the Provider, within fifteen (15) business days. If the Provider fails to propose a suitable Replacement Professional within this timeframe, the Customer shall not be liable for any remaining Fees associated with the original Professional. Should the Provider propose a Replacement Professional within fifteen (15) business days of receiving the Customer’s written notice and the Customer opts not to accept the Replacement Professional and continue the Services, the Customer remains liable for the entirety of the Fees for the remaining Term. In the event that a Replacement Professional is provided and Services are performed by the Replacement Professional, the Provider shall issue to the Customer a service credit proportionate to the period during which the Professional or the Replacement Professional was unable to render the Services (the “Service Credit”). This Service Credit shall be applicable towards future Services performed under the terms and conditions of this Contract. During the Renewal Term (as defined below), should the Customer determine that the Professional is not suitable for the role, then, upon written notice and detailed explanation from the Customer regarding the unsuitability of the Professional, the Provider will use its best efforts to provide the Customer with a reasonably suitable Replacement Professional, as determined by the Provider, within fifteen (15) business days. If the Customer declines the Services of the proposed Replacement Professional, the Customer shall be responsible for all remaining Fees during the applicable Renewal Term.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(e) Reservation of Rights. Provider reserves all rights not expressly granted to Customer in this Contract. Except for the limited rights and licenses expressly granted under this Contract, nothing in this Contract grants, by implication, waiver, estoppel, or otherwise, to Customer or any third party any intellectual property rights or other right, title, or interest in or to the intellectual property of Provider, including but not limited to copyrights, copyright licenses, patents, patent licenses, trademarks, trademark licenses, technology, know-how and processes (collectively, “",
        },
        {
          type: "text",
          value: "Provider IP",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value: "”).",
        },
      ],
    },
    {
      type: "heading",
      anchor: "contract-section-25",
      level: 2,
      content: [
        {
          type: "text",
          value: "2. ",
        },
        {
          type: "text",
          value: "Customer Responsibilities.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(a) Customer shall conduct an initial orientation and evaluation for each Professional upon the commencement of work for Customer. The initial evaluation shall be made available to Provider upon request.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(b) Within the first two weeks of a Professional’s engagement, Customer shall conduct weekly meetings with Professional and Provider’s team to ensure priorities and responsibilities are adequately assessed.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(c) Customer shall hold meetings with Provider at regular monthly intervals (exact times to be determined) to evaluate the Professionals’ progress and to assess fit and Customer satisfaction. Customer shall use the Provider’s performance review template to document the evaluation.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(d) Customer shall provide Professionals with access to Customer’s necessary internal technology systems, programs, and software subscriptions required to perform the services under this Contract. Customer shall be responsible for the costs associated with and related to any of the foregoing.",
        },
      ],
    },
    {
      type: "heading",
      anchor: "contract-section-35",
      level: 2,
      content: [
        {
          type: "text",
          value: "3. ",
        },
        {
          type: "text",
          value: "Fees and Payment.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(a) Fees.",
        },
        {
          type: "text",
          value: " ",
          marks: {
            bold: true,
          },
        },
        {
          type: "text",
          value: 'Customer shall pay Provider the fees ("',
        },
        {
          type: "text",
          value: "Fees",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            '") as set forth in Exhibit A, as may be amended by the parties from time to time in writing (subject to Section 1(c)), without offset or deduction. ',
        },
        {
          type: "text",
          value:
            "Customer shall make all payments hereunder in US dollars on or before the due date set forth below.",
        },
        {
          type: "text",
          value:
            " If Customer fails to make any payment when due, without limiting Provider's other rights and remedies: (i) Provider may charge a late fee on the past due amount at the rate of Fifty Dollars and No Cents ($50.00) per day beginning when the invoice is fourteen (14) days overdue; (ii) Customer shall reimburse Provider for all reasonable costs incurred by Provider in collecting any late payments or interest, including attorneys' fees, court costs, and collection agency fees; and (iii) Provider may suspend Customer's access to any portion or all of the Services until such amounts are paid in full. For the avoidance of doubt, no Services by any Professional engaged hereunder shall commence unless and until initial payment is initiated by Customer, as confirmed by Provider. The Monthly Fee applicable to each Professional shall increase by seven percent (7%) on each annual anniversary of the Initial Term Start Date, including during any Renewal Term. Such increase shall apply automatically without the need for further notice or amendment and shall be reflected in the applicable invoice for the Renewal Term or annual billing cycle, as applicable",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(i)",
          marks: {
            italic: true,
          },
        },
        {
          type: "text",
          value: " ",
        },
        {
          type: "text",
          value: "Initial Term Fee",
          marks: {
            italic: true,
          },
        },
        {
          type: "text",
          value:
            ". Customer shall pay the applicable fee set out in the Statement of Work for the Initial Term in its entirety for each Professional, payable in full in a one-time, lump-sum payment on or before the commencement of the Initial Term.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: " (ii)",
          marks: {
            italic: true,
          },
        },
        {
          type: "text",
          value: " ",
        },
        {
          type: "text",
          value: "Renewal Term Fee",
          marks: {
            italic: true,
          },
        },
        {
          type: "text",
          value:
            ". Customer shall pay the applicable fee set out in the Statement of Work for the Renewal Term in its entirety for each Professional, payable in full in a one-time, lump-sum payment on or before the start date of each applicable Renewal Term.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(iii)",
          marks: {
            italic: true,
          },
        },
        {
          type: "text",
          value: " ",
        },
        {
          type: "text",
          value: "Equipment Fee",
          marks: {
            italic: true,
          },
        },
        {
          type: "text",
          value:
            ". Provider shall provide each Professional with various hardware (the “Equipment”) to perform the related Services under this Contract. For each Professional, Customer shall pay Provider a one-time Equipment fee in the amount of One Thousand Seven Hundred and Fifty Dollars and No Cents ($1,750.00) (the “",
        },
        {
          type: "text",
          value: "Equipment Fee",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            "”) on or before the applicable start date for each Professional. In no event shall the Equipment Fee be refunded to Customer.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(b) Automatic Payment Authorization. Customer hereby authorizes Provider to automatically charge the payment method provided by Customer to Provider for all Fees due under this Contract. Customer is responsible for maintaining a valid and current payment method with Provider and may update their payment information by notifying Provider in accordance with Section 11(b) of this Contract. In the event of any dispute related to charges, Customer agrees to first contact Provider to resolve the issue.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(c) Taxes. All Fees and other amounts payable by Customer under this Contract are exclusive of taxes and similar assessments. Customer is responsible for all sales, use, and excise taxes, and any other similar taxes, duties, and charges of any kind imposed by any federal, state, or local governmental or regulatory authority on any amounts payable by Customer hereunder, other than any taxes imposed on Provider's income.",
        },
      ],
    },
    {
      type: "heading",
      anchor: "contract-section-49",
      level: 2,
      content: [
        {
          type: "text",
          value: "4. ",
        },
        {
          type: "text",
          value: "Confidential Information.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            'From time to time during the Term, either Party may disclose or make available to the other Party information about its business affairs, products, confidential intellectual property, trade secrets, third-party confidential information, and other sensitive or proprietary information, including “protected health information” (PHI) as that term is defined under the Health Insurance Portability and Accountability Act of 1996 (HIPAA), whether orally or in written, electronic, or other form or media, and whether or not marked, designated, or otherwise identified as "confidential" (collectively, "',
        },
        {
          type: "text",
          value: "Confidential Information",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            "\"). Confidential Information does not include information that, at the time of disclosure is: (a) in the public domain; (b) known to the receiving Party at the time of disclosure; (c) rightfully obtained by the receiving Party on a non-confidential basis from a third party; or (d) independently developed by the receiving Party. The receiving Party shall not use or disclose the disclosing Party's Confidential Information to any person or entity, except to the receiving Party's employees who have a need to know the Confidential Information for the receiving Party to exercise its rights or perform its obligations hereunder. Notwithstanding the foregoing, each Party may disclose Confidential Information to the limited extent required (i) in order to comply with the order of a court or other governmental body, or as otherwise necessary to comply with applicable law, provided that the Party making the disclosure pursuant to the order shall first have given written notice to the other Party and made a reasonable effort to obtain a protective order; or (ii) to establish a Party's rights under this Contract, including to make required court filings. On the expiration or termination of the Contract, the receiving Party shall promptly return to the disclosing Party all copies, whether in written, electronic, or other form or media, of the disclosing Party's Confidential Information, or destroy all such copies and certify in writing to the disclosing Party that such Confidential Information has been destroyed. Each Party's obligations of non-disclosure with regard to Confidential Information are effective as of the Effective Date and will expire five years from the date first disclosed to the receiving Party; provided, however, with respect to any Confidential Information that constitutes a trade secret (as determined under applicable law), such obligations of non-disclosure will survive the termination or expiration of this Contract for as long as such Confidential Information remains subject to trade secret protection under applicable law.",
        },
      ],
    },
    {
      type: "heading",
      anchor: "contract-section-53",
      level: 2,
      content: [
        {
          type: "text",
          value: "5. ",
        },
        {
          type: "text",
          value: "Intellectual Property Ownership.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(a) Provider IP and Customer IP. Customer acknowledges that, as between Customer and Provider, Provider owns all right, title, and interest, including all intellectual property rights, in and to the Provider IP. ",
        },
        {
          type: "text",
          value:
            "Provider acknowledges that, as between Customer and Provider, Customer owns all right, title, and interest, including all intellectual property rights, in and to the Customer IP.",
        },
        {
          type: "text",
          value: "",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(b) Marketing Rights. Customer hereby grants to the Provider a non-exclusive, non-transferable, revocable right to use the Customer's trademarks, service marks, and logos (the “",
        },
        {
          type: "text",
          value: "Marks",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            "”) solely for the purpose of marketing and promoting the Services provided under this Contract. The Provider agrees to use the Marks in strict accordance with any brand guidelines provided by the Customer. The Provider further agrees not to alter, modify, or change the Marks in any manner without the prior written consent of the Customer.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(c) Work Product and Deliverables. Provider represents and warrants that it will disclose and assign to the Customer, and does hereby assign and agrees to assign to the Customer all copyright, trade secret and all other intellectual or proprietary rights, whether registered or unregistered, and all moral rights thereto, which Professional(s) and Provider may possess or be entitled to receive, in each and every territory, state and country throughout the world, and under all applicable conventions and treaties (“",
        },
        {
          type: "text",
          value: "Intellectual Property Rights",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            "”) in all inventions (whether or not patentable or reduced to practice), models, works of authorship, databases, designs, mask works, computer programs, data, drawings, know-how, information and other forms of intellectual property that are created, discovered, conceived of or reduced to practice by Provider or the Professional(s), directly or indirectly, during the Term in the performance of the Services, or that are embodied, incorporated or used in any products, samples, formulae, drawings, specifications, computer program, software, manuals, data, documentation, models, prototypes, information or other materials or items created or prepared by the Professional(s) in the performance of the Services (collectively “",
        },
        {
          type: "text",
          value: "Work Product",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            "”) or any reports or deliverables created expressly for Customer by Provider or the Professional(s) (the “",
        },
        {
          type: "text",
          value: "Deliverables",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            "”) (the Intellectual Property Rights, Work Product, Deliverables, and any pre-existing intellectual property owned by Customer, collectively, the “",
        },
        {
          type: "text",
          value: "Customer IP",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            "”). Notwithstanding the foregoing, to the extent applicable to the Provider’s status as an independent contractor, the Work Product and Deliverables will be considered and treated for all purposes as works ‘made for hire’, and rights, title and interest to all Intellectual Property Rights respecting such Work Product will vest exclusively in the Customer upon payment of outstanding invoices.",
        },
      ],
    },
    {
      type: "heading",
      anchor: "contract-section-61",
      level: 2,
      content: [
        {
          type: "text",
          value: "6. ",
        },
        {
          type: "text",
          value: "Warranty Disclaimer.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            '(a) THE SERVICES ARE PROVIDED "AS IS" AND PROVIDER HEREBY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. PROVIDER SPECIFICALLY DISCLAIMS ALL IMPLIED WARRANTIES OF MERCHANTABILITY, TITLE, AND NON-INFRINGEMENT, AND ALL WARRANTIES ARISING FROM COURSE OF DEALING, USAGE, OR TRADE PRACTICE. PROVIDER MAKES NO WARRANTY THAT THE SERVICES WILL ACHIEVE ANY OUTCOME.',
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(b) Notwithstanding any pre-screening or training of the Professionals as performed by the Provider, the Provider makes no representation or warranty as to the qualifications, suitability, or prospective performance of the Professionals delegated hereunder. The Customer acknowledges its duty to verify and evaluate the Professionals, with the sole remedy for inadequate performance or misconduct being the Customer’s right to terminate a Professional or this Contract in accordance with the terms herein.",
        },
      ],
    },
    {
      type: "heading",
      anchor: "contract-section-67",
      level: 2,
      content: [
        {
          type: "text",
          value: "7. ",
        },
        {
          type: "text",
          value: "Limitations of Liability.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "IN NO EVENT WILL PROVIDER BE LIABLE UNDER OR IN CONNECTION WITH THIS CONTRACT UNDER ANY LEGAL OR EQUITABLE THEORY, INCLUDING BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, AND OTHERWISE, FOR ANY: (a) CONSEQUENTIAL, INCIDENTAL, INDIRECT, EXEMPLARY, SPECIAL, ENHANCED, OR PUNITIVE DAMAGES; (b) INCREASED COSTS, DIMINUTION IN VALUE OR LOST BUSINESS, PRODUCTION, REVENUES, OR PROFITS; (c) LOSS OF GOODWILL OR REPUTATION; (d) USE, INABILITY TO USE, LOSS, INTERRUPTION, DELAY, OR RECOVERY OF ANY DATA, OR BREACH OF DATA OR SYSTEM SECURITY; OR (e) COST OF REPLACEMENT GOODS OR SERVICES, IN EACH CASE REGARDLESS OF WHETHER PROVIDER WAS ADVISED OF THE POSSIBILITY OF SUCH LOSSES OR DAMAGES OR SUCH LOSSES OR DAMAGES WERE OTHERWISE FORESEEABLE. IN NO EVENT WILL PROVIDER'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS CONTRACT UNDER ANY LEGAL OR EQUITABLE THEORY, INCLUDING BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, AND OTHERWISE EXCEED THE TOTAL AMOUNTS PAID TO PROVIDER UNDER THIS CONTRACT IN THE 180 DAY PERIOD PRECEDING THE EVENT GIVING RISE TO THE CLAIM.",
        },
      ],
    },
    {
      type: "heading",
      anchor: "contract-section-71",
      level: 2,
      content: [
        {
          type: "text",
          value: "8. ",
        },
        {
          type: "text",
          value: "Term and Termination.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(a) Term of Contract.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(i) ",
        },
        {
          type: "text",
          value: "Term",
          marks: {
            italic: true,
          },
        },
        {
          type: "text",
          value:
            ". This Contract shall commence on the Effective Date and remain in effect during the period in which any Professional is subscribed hereunder during the Initial Term and each Renewal Term (as defined in Section 8(b)(i) herein); provided that the Contract shall terminate upon the termination of Services by all Professionals subscribed hereunder unless otherwise agreed by the Parties.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(b)  Professional Terms.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(i)",
          marks: {
            italic: true,
          },
        },
        {
          type: "text",
          value: " ",
        },
        {
          type: "text",
          value: "Initial Term Commitment",
          marks: {
            italic: true,
          },
        },
        {
          type: "text",
          value:
            ". For each Professional provided by Provider to Customer, there shall be an initial three (3) month term commencing and expiring on the dates set forth in Exhibit A (the “Initial Term”). This Contract will automatically renew for successive terms of three (3) months (each, a “Renewal Term” and such Renewal Term(s) if any together with the Initial Term, the “Term”) until terminated by either Party in accordance with Section 8(C).",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(ii) Liability for Payment",
          marks: {
            italic: true,
          },
        },
        {
          type: "text",
          value:
            ". Regardless of whether the Customer fully utilizes the Services during the Initial Term or any Renewal Term, the Customer is obligated to pay the full Fees for the entire Initial Term and Renewal Term. This obligation is designed to reflect the fixed costs and resource allocation undertaken by Provider in anticipation of each Party’s performance of its obligations under this Contract.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(iii) Early Termination Fees and Rebates",
          marks: {
            italic: true,
          },
        },
        {
          type: "text",
          value:
            ". Except for terminations pursuant to Section 8(c) herein, neither Party may terminate this Contract prior to the expiration of the Initial Term. In the event of early termination by Customer during a Renewal Term, Provider shall provide Customer with a rebate in the amount equal to fifty percent (50%) of the monthly Fees for each Professional for the remaining months left in the Renewal Term from the date of termination (the “Early Termination Rebate”). If Customer owes any Fees on the date of termination, Provider shall have the right to offset the Early Termination Rebate in the amount due and payable to Provider at the time of termination, and any amounts owed in excess of the Early Termination Rebate shall become due and payable to Provider on the effective date of termination, regardless of whether the Services of the Professionals are ultimately rendered within such period. In the event of an early termination by Provider, Customer shall only be responsible for payment of Fees up to the effective date of termination and Provider shall provide to Customer a pro rata refund for any amounts overpaid by Customer. The Parties agree that time is of the essence with respect to the written notice period set forth herein.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(c) Termination. In addition to any other express termination right set forth in this Contract, this Contract may be terminated as follows:",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(i) Provider may terminate this Contract, effective upon written notice to Customer, if Customer violates any provision of this Contract, including but not limited to Customer’s failure to pay any amount when due hereunder or breach of its obligations under Section 4.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(ii) Either Party may terminate this Contract, effective immediately upon written notice to the other Party, if the other Party: (A) becomes insolvent or is generally unable to pay, or fails to pay, its debts as they become due; (B) files or has filed against it, a petition for voluntary or involuntary bankruptcy or otherwise becomes subject, voluntarily or involuntarily, to any proceeding under any domestic or foreign bankruptcy or insolvency law; (C) makes or seeks to make a general assignment for the benefit of its creditors; (D) applies for or has appointed a receiver, trustee, custodian, or similar agent appointed by order of any court of competent jurisdiction to take charge of or sell any material portion of its property or business",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(iii) Either Party may terminate this Contract effective upon the conclusion of the Initial Term or Renewal Term, as applicable, by delivering written notice of nonrenewal not less than thirty (30) days’ prior to the commencement of the next Renewal Term, as applicable.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(iv) Customer may terminate the subscription of any Professional without further liability for any future Fees associated with such Professional, upon delivery of ten (10) business days prior written notice of any of the causes described in Section 8(c)(iv)(A)-(C) below; ",
        },
        {
          type: "text",
          value: "provided that,",
          marks: {
            italic: true,
          },
        },
        {
          type: "text",
          value:
            " if Provider provides Customer access to a suitable replacement Professional within ten (10) business days of Customer providing written notice of any of the following circumstances, the Term shall not be terminated:",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(A) Upon conduct by a Professional that is reasonably considered by Customer to be unethical, unprofessional, fraudulent, unlawful, or adverse to the interest, reputation, or business of Customer;",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(B) Upon material violation by a Professional of the rules, policies, and/or procedures of Customer, in the form provided by Customer to Provider in advance; or",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(C) Upon a Professional’s conviction of a felony or crime of moral turpitude during the Term.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(d) Survival. This Section 8(d) (Survival) and 3 (Fees and Payment), 4 (Confidential Information), 5 (Intellectual Property Ownership), 6(a) (Warranties Disclaimer), 7 (Limitations of Liability), 9 (Non-Solicitation; Non-Interference) and 11 (Miscellaneous) survive any termination or expiration of this Contract.",
        },
      ],
    },
    {
      type: "heading",
      anchor: "contract-section-103",
      level: 2,
      content: [
        {
          type: "text",
          value: "9. ",
        },
        {
          type: "text",
          value: "NON-SOLICITATION; Non-Interference.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(a) ",
        },
        {
          type: "text",
          value: "Definitions.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(i) ",
        },
        {
          type: "text",
          value: "For purposes of this Section 9, “",
        },
        {
          type: "text",
          value: "to solicit, induce, or encourage",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            "” means to initiate contact with or engage in discussions with Provider Personnel to retain Provider Personnel as an independent contractor, employee, or worker for the same or similar services provided to the Customer.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(ii) ",
        },
        {
          type: "text",
          value: "“",
        },
        {
          type: "text",
          value: "Restricted Period",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            "” shall mean the term commencing on the Effective Date of this Contract and expiring two (2) years immediately following the termination of this Contract.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(iii) ",
        },
        {
          type: "text",
          value: "“",
        },
        {
          type: "text",
          value: "Restricted Territory",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            "” shall mean the geographic location in which any Provider Personnel provides services on behalf of the Provider, including the United States of America, United Kingdom, Europe, Australia, Canada and Sri Lanka.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(iv) ",
        },
        {
          type: "text",
          value: "“",
        },
        {
          type: "text",
          value: "Representatives",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            "” means a Party’s officers, directors, managers, members, partners, shareholders, employees, controlling persons, agents, representatives, parents, affiliates, subsidiaries, successors, and assigns.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(v) ",
        },
        {
          type: "text",
          value: "For purposes of this Section, any references to “",
        },
        {
          type: "text",
          value: "deliver services to",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            "” shall include any engagement for work, whether paid or unpaid, without regard to the relevant Provider Personnel’s subsequent title or status under any State or Federal laws, including without limitation working engagements for employment, independent contractor services (whether delivered directly by Provider Personnel or through an affiliate business entity owned or controlled in part or full by Provider Personnel), internships, externships, volunteer engagements, apprenticeships, or engagements with sole proprietorships which provide services to others.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(vi) ",
        },
        {
          type: "text",
          value: "“",
        },
        {
          type: "text",
          value: "Provider Personnel",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            "” shall include any personnel of Provider who is or was, within twelve (12) months of the effective date of termination of this Contract, involved with the provision of the Services or receipt of the benefits thereof provided under this Contract.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(b) ",
        },
        {
          type: "text",
          value:
            "Non-Solicitation. Customer acknowledges and agrees that the Provider has expended and continues to expend significant time and expense in recruiting and training its Provider Personnel and that the loss of Provider Personnel would cause significant and potentially irreparable harm to the Provider. Because of Provider’s legitimate business interest as described in this Section 9(a), Customer agrees that, unless otherwise agreed to by the Parties in writing, during the Restricted Period in the Restricted Territory, Customer shall not, and Customer shall cause its Representatives to not, directly or indirectly through third parties or otherwise, solicit, induce, or encourage any Provider Personnel, or attempt to solicit, induce, assist in the inducement, or encourage any Provider Personnel, to cease or reduce delivering services for Provider in order to enter into any engagement with Provider Personnel to deliver services to Customer or any Customer Representative or business enterprise otherwise affiliated with Customer or its Customer Representatives.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(c) ",
        },
        {
          type: "text",
          value:
            "Non-Interference. Both Parties agrees that during the term of this Contract and for a period of twenty-four (24) months following any termination of this Contract, each Party shall not, for itself or any third party, directly or indirectly, divert or attempt to divert from the other Party (or any affiliate of it that might be formed) any business of any kind in which the other Party is engaged including, without limitation, the solicitation of or interference with any of its customers, clients, vendors or other business relations.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(d) ",
        },
        {
          type: "text",
          value: "Remedies.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(i) ",
        },
        {
          type: "text",
          value:
            "Any and all violations of Section 9(b) by Customer shall result in a fee payable to Provider within ten (10) days of such Customer’s breach of this Section in an amount equal to the annual Fees associated with the applicable Professional, calculated by using such Professional’s then-current billing rate (as described in Exhibit A) multiplied by twelve (12) months or, if the then-current billing rate is an hourly rate, by two thousand (2,000) hours.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(ii) ",
        },
        {
          type: "text",
          value:
            "Any and all violations of Section 9(c) by either Party shall result in a fee payable to the non-breaching Party within ten (10) days of such the breaching Party’s breach of Section 9(c) in an amount equal to the annual revenue associated with the applicable customer, client, vendor, or other business relation, calculated by using such customer’s, client’s vendor’s, or other business relation’s then-current fee structure, multiplied by twelve (12) months.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(iii) ",
        },
        {
          type: "text",
          value:
            "THE REMEDIES DESCRIBED IN THIS SECTION 9 ARE NOT A PENALTY AND ARE A LIQUIDATED DAMAGE IN LIEU OF A CLAIM FOR DAMAGES SPECIFICALLY FOR A BREACH OF THIS SECTION 9, AS THE PARTIES AGREE THAT THE DAMAGES WOULD BE DIFFICULT TO CALCULATE AND UNCERTAIN, AND THEY DESIRE TO QUANTIFY SUCH AMOUNTS. Each Party acknowledges and agrees that a breach of this Section 9 could not adequately be compensated by money damages, and, therefore, the non-breaching Party shall be entitled, in addition to any other right and remedy available to it, to an injunction restraining any breach or threatened breach, and the non-breaching Party shall not be required to post a bond in any proceeding brought for such purpose. Each Party further acknowledges and agrees that the provisions of this Section 9 are necessary and reasonable to protect each Party in the conduct of its business. Nothing herein shall be construed as prohibiting either Party from pursuing any other remedies, at law or in equity, for any such breach or threatened breach of this Section 9. The Parties acknowledge that the restrictions contained in this Section 9 are reasonable and necessary to protect the legitimate interests of the Parties and constitute a material inducement to each Party entering into this Contract and consummate the transactions contemplated by this Contract. In the event that any covenant contained in this Section 9 should ever be adjudicated to exceed the time, geographic, product or service, or other limitations permitted by applicable laws in any jurisdiction, then any court is expressly empowered to reform such covenant to the extent necessary to conform with such applicable laws, and such covenant shall be deemed reformed in such jurisdiction to the maximum time, geographic, product or service, or other limitations permitted by applicable laws. The covenants contained in this Section 9 and each provision hereof are severable and distinct covenants and provisions. The invalidity or unenforceability of any such covenant or provision as written shall not invalidate or render unenforceable the remaining covenants or provisions hereof, and any such invalidity or unenforceability in any jurisdiction shall not invalidate or render unenforceable such covenant or provision in any other jurisdiction.",
        },
      ],
    },
    {
      type: "heading",
      anchor: "contract-section-132",
      level: 2,
      content: [
        {
          type: "text",
          value: "10. ",
        },
        {
          type: "text",
          value: "Information Security.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(a) Compliance with Customer Policies.",
        },
        {
          type: "text",
          value: " ",
          marks: {
            bold: true,
          },
        },
        {
          type: "text",
          value:
            "Provider acknowledges and agrees that, in the performance of the Services hereunder, Professionals may create, receive, or have access to Personal Information. Professionals shall comply with the terms and conditions set forth in the Customer Policies (as defined below) in their creation, collection, receipt, transmission, storage, disposal, use, and disclosure of such Personal Information and be responsible for any unauthorized creation, collection, receipt, transmission, access, storage, disposal, use, or disclosure of Personal Information under its control or in its possession. “Customer Policies” means any policies provided in advance by Customer to the applicable Professional that relate to the Customer’s standard lawful practices in handling, storing, using, and/or disposing of Personal Information.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(b) Return of Personal Information. At any time during the Term of this Contract or upon the termination of this Contract, at Customer’s request, Professionals shall promptly return to Customer all copies, whether in written, electronic, or other form or media, of Personal Information in its possession, or securely dispose of all such copies, and certify in writing to Customer that such Personal Information has been returned to Customer or disposed of securely.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(c) Sharing of Highly Sensitive Personal Information. ",
        },
        {
          type: "text",
          value:
            "Customer warrants and agrees that it shall be solely responsible for any Highly Sensitive Personal Information in its possession.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(d) Certain Definitions.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(i) ",
          marks: {
            italic: true,
          },
        },
        {
          type: "text",
          value: " “",
        },
        {
          type: "text",
          value: "Personal Information",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            "” means information which is created or obtained by one Party on behalf of the other Party, or information to which access was provided to one Party by or at the direction of the other Party, in the course of the Parties’ performance under this Contract that: (i) identifies or can be used to identify an individual (including, without limitation, names, signatures, addresses, telephone numbers, email addresses, and other unique identifiers); or (ii) can be used to identify or authenticate an individual (including, without limitation, employee identification numbers, government-issued identification numbers, passwords, user identification and account access credentials or passwords, student information, answers to security questions, an individual's internet activity or similar interaction history, inferences drawn from other personal information to create consumer profiles, geolocation data, an individual's commercial, employment, or education history, and other personal characteristics and identifiers), in case of both subclauses (i) and (ii), including, without limitation, all Sensitive Personal Information. Either Party’s business contact information is not by itself deemed to be Personal Information.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(ii)",
          marks: {
            italic: true,
          },
        },
        {
          type: "text",
          value: " “",
        },
        {
          type: "text",
          value: "Sensitive Personal Information",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            "” means an individual's (i) government-issued identification number (including Social Security number, driver's license number, or state-issued identification number); or (ii) geolocation data.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "(iii)",
          marks: {
            italic: true,
          },
        },
        {
          type: "text",
          value: " “",
        },
        {
          type: "text",
          value: "Highly Sensitive Personal Information",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value: "”",
        },
        {
          type: "text",
          value: " ",
          marks: {
            bold: true,
          },
        },
        {
          type: "text",
          value:
            "means (i) financial account number, credit card number, debit card number, or credit report information, with or without any required security code, access code, personal identification number, or password that would permit access to an individual's financial account; or (ii) biometric, genetic, health, medical, or medical insurance data.",
        },
      ],
    },
    {
      type: "heading",
      anchor: "contract-section-148",
      level: 2,
      content: [
        {
          type: "text",
          value: "11. ",
        },
        {
          type: "text",
          value: "Miscellaneous.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(a) Entire Contract. This Contract, together with any other documents incorporated herein by reference and all related Exhibits, constitutes the sole and entire contract of the Parties with respect to the subject matter of this Contract and supersedes all prior and contemporaneous understandings, contracts, and representations and warranties, both written and oral, with respect to such subject matter. In the event of any inconsistency between the statements made in the body of this Contract, the related Exhibits, and any other documents incorporated herein by reference, the following order of precedence governs: (i) first, this Contract, excluding its Exhibits; (ii) second, the Exhibits to this Contract as of the Effective Date; and (iii) third, any other documents incorporated herein by reference.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            '(b) Notices. All notices, requests, consents, claims, demands, waivers, and other communications hereunder (each, a "',
        },
        {
          type: "text",
          value: "Notice",
          marks: {
            bold: true,
            italic: true,
          },
        },
        {
          type: "text",
          value:
            '") must be in writing and addressed to the Parties at the addresses set forth below (or to such other address that may be designated by the Party giving Notice from time to time in accordance with this Section). All Notices must be delivered by personal delivery, nationally recognized overnight courier (with all fees pre-paid), facsimile or email (with confirmation of transmission), or certified or registered mail (in each case, return receipt requested, postage pre-paid). Except as otherwise provided in this Contract, a Notice is effective only: (i) upon receipt by the receiving Party; and (ii) if the Party giving the Notice has complied with the requirements of this Section.',
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "If to Provider:",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "Oceans XYZ, LLC",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "P.O. Box #238",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "Alstead, NH 03602",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "Attention: Ian Myers",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "Email: hello@oceansxyz.com",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "For billing-related communications: payments@oceansxyz.com",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "If to the Customer:",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: " Attn:",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: " Address:",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "Email:",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(c) Relationship of Parties. The Parties agree that the relationship between Provider and Customer is that of independent contractors. No employment, joint venture, agency, partnership, or similar relationship is formed by this Contract, and neither Party shall have any authority to act for or bind the other.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(d) Insurance. Upon request, Provider shall provide a Certificate of Insurance to Customer showing evidence of Provider’s current Professional Liability and General Liability policies. Insurance coverage shall not be less than One Million Dollars and No Cents ($1,000,000.00) per occurrence and Two Million Dollars and No Cents ($2,000,000.00) in aggregate covering acts or omissions, which may give rise to liability for Services performed under this Contract.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(e) Force Majeure. In no event shall either Party be liable to the other Party, or be deemed to have breached this Contract, for any failure or delay in performing its obligations under this Contract (except for any obligations to make payments), if and to the extent such failure or delay is caused by any circumstances beyond such Party's reasonable control, including but not limited to acts of God, flood, fire, earthquake, explosion, war, terrorism, invasion, riot or other civil unrest, strikes, labor stoppages or slowdowns or other industrial disturbances, or passage of law or any action taken by a governmental or public authority, including imposing an embargo.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(f) Amendment and Modification; Waiver. No amendment to or modification of this Contract is effective unless it is in writing and signed by an authorized representative of each Party. No waiver by any Party of any of the provisions hereof will be effective unless explicitly set forth in writing and signed by the Party so waiving. Except as otherwise set forth in this Contract, (i) no failure to exercise, or delay in exercising, any rights, remedy, power, or privilege arising from this Contract will operate or be construed as a waiver thereof, and (ii) no single or partial exercise of any right, remedy, power, or privilege hereunder will preclude any other or further exercise thereof or the exercise of any other right, remedy, power, or privilege.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(g) Severability. If any provision of this Contract is invalid, illegal, or unenforceable in any jurisdiction, such invalidity, illegality, or unenforceability will not affect any other term or provision of this Contract or invalidate or render unenforceable such term or provision in any other jurisdiction. Upon such determination that any term or other provision is invalid, illegal, or unenforceable, the Parties shall negotiate in good faith to modify this Contract so as to effect their original intent as closely as possible in a mutually acceptable manner in order that the transactions contemplated hereby be consummated as originally contemplated to the greatest extent possible.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(h) Governing Law; Dispute Resolution. This Contract is governed by and construed in accordance with the internal laws of the State of Texas without giving effect to any choice or conflict of law provision or rule that would require or permit the application of the laws of any jurisdiction other than those of the State of Texas. Any and all claims or disputes between Customer and Provider (including, without limitation, the validity, scope, and enforceability of this Section and claims arising under any federal, state, or local law) shall be submitted for final and binding arbitration before a single arbitrator in the State of Texas in accordance with the then-applicable rules for resolution of commercial disputes of the American Arbitration Association. The Parties will select one arbitrator, which arbitrator shall issue a reasoned decision and apply the substantive law of the State of Texas (excluding Texas choice-of-law principles that might call for the application of some other state’s law), or federal law, or both as applicable to the claims asserted. The results of the arbitration and the decision of the arbitrator will be final and binding on the Parties and each Party agrees and acknowledges that these results shall be enforceable in a court of law. All proceedings conducted pursuant to this contract to arbitrate, including any order, decision, or award of the arbitrator, shall be kept confidential by all Parties. Notwithstanding the foregoing, Customer and Provider acknowledge and agree that a court of competent jurisdiction shall have the power to maintain the status quo pending the arbitration of any dispute under this Section, and this Section shall not require the arbitration of an application for emergency or temporary injunctive relief by either Party pending arbitration; provided, however, that the remainder of any such dispute beyond the application for emergency or temporary injunctive relief shall be subject to arbitration under this Section. ",
        },
        {
          type: "text",
          value:
            "THE PARTIES ACKNOWLEDGE THAT, BY SIGNING THIS CONTRACT, THEY ARE KNOWINGLY AND VOLUNTARILY WAIVING ANY RIGHT THAT THEY MAY HAVE TO A JURY TRIAL.",
          marks: {
            bold: true,
          },
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(i) Attorneys’ Fees. If any action in law or in equity is necessary for Provider to enforce or interpret the terms of this Contract, Provider shall be entitled to attorneys’ fees, costs, and necessary disbursements in addition to any other relief to which Provider incurred with respect to such action. Such fees may be awarded in the same suit or recovered in a separate suit, whether or not such action or proceeding is pursued to decision or judgment. The attorneys’ fees award shall not be computed in accordance with any court fee schedule, but shall be such as to fully reimburse all attorneys’ fees reasonably incurred. Provider shall be entitled to attorneys’ fees, costs and expenses incurred in preparation and services of notices of default and consultation in connection therewith, whether or not a legal action is subsequently commenced in connection with such default or resulting breach.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(j) Assignment. Customer may not assign any of its rights or delegate any of its obligations hereunder, in each case whether voluntarily, involuntarily, by operation of law or otherwise, without the prior written consent of Provider. Any purported assignment or delegation in violation of this Section will be null and void. No assignment or delegation will relieve the assigning or delegating Party of any of its obligations hereunder. This Contract is binding upon and inures to the benefit of the Parties and their respective permitted successors and assigns.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(k) Equitable Relief. Each Party acknowledges and agrees that a breach or threatened breach by such Party of any of its obligations under 4 would cause the other Party irreparable harm for which monetary damages would not be an adequate remedy and agrees that, in the event of such breach or threatened breach, the other Party will be entitled to equitable relief, including a restraining order, an injunction, specific performance, and any other relief that may be available from any court, without any requirement to post a bond or other security, or to prove actual damages or that monetary damages are not an adequate remedy. Such remedies are not exclusive and are in addition to all other remedies that may be available at law, in equity, or otherwise.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(l) Counterparts. This Contract may be executed in counterparts, each of which is deemed an original, but all of which together are deemed to be one and the same contract.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "[Balance of Page Left Intentionally Blank; Signature Page Follows]",
          marks: {
            italic: true,
          },
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "IN WITNESS WHEREOF, the Parties hereto have executed this Contract as of the Effective Date.",
        },
      ],
    },
    {
      type: "table",
      variant: "signature",
      rows: [
        ["PROVIDER", "CUSTOMER"],
        ["OCEANS XYZ, LLC", "______________________________"],
        [
          "By:_______________________________",
          "By:_____________________________",
        ],
        ["Name: Ian Myers", "Name:"],
        ["Title: Chief Executive Officer", "Title:"],
      ],
    },
    {
      type: "heading",
      anchor: "contract-section-227",
      level: 2,
      content: [
        {
          type: "text",
          value: "EXHIBIT A",
        },
      ],
    },
    {
      type: "heading",
      anchor: "contract-section-228",
      level: 2,
      content: [
        {
          type: "text",
          value: "STATEMENT OF WORK",
          marks: {
            bold: true,
          },
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "Capitalized terms used but not defined in this Exhibit A have the meaning given to those terms in the Contract. In the event of any conflict of terms between this Statement of Work and the Contract, the terms of this Statement of Work shall control.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "A. DESCRIPTION OF SERVICES TO BE PERFORMED BY PROFESSIONALS:",
          marks: {
            bold: true,
          },
        },
      ],
    },
    {
      type: "table",
      rows: [
        ["Professional", "Description of Services"],
        ["", ""],
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value: "B. FEES: ",
          marks: {
            bold: true,
          },
        },
        {
          type: "text",
          value:
            "Fees shall be payable as set forth below. No Services by any Professional engaged hereunder shall commence unless and until initial payment is initiated by Customer, as confirmed by Provider.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(i) Initial Term. During the Initial Term for the Professional(s) designated in the table below, Customer shall pay Provider the applicable monthly fee set forth in the table below, which shall be paid in a one-time lump-sum payment for all months included in the Initial Term for each Professional prior to the commencement of the Initial Term.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(ii) Renewal Term. During each Renewal Term for the Professional(s) designated in the table below, Customer shall pay Provider the applicable monthly fee set forth in the table below, which shall be paid in a one-time lump-sum payment for all months included in the Renewal Term for each Professional prior to the commencement of the Renewal Term.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(iii) Equipment Fee. For the Professional(s) designated in the table below, in accordance with Section 3(a)(iv) of the Contract, Customer shall pay Provider a non-refundable Equipment Fee in the amount of One Thousand Seven Hundred and Fifty Dollars and No Cents ($1,750.00).",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          value:
            "(iv) Annual Adjustment. The Monthly Fee listed above for each Professional shall be subject to an automatic seven percent (7%) increase on each annual anniversary of the Initial Term Start Date.",
        },
      ],
    },
    {
      type: "table",
      rows: [
        [
          "Professional(s)",
          "Initial Term Start",
          "Renewal Term Start",
          "Monthly Fee",
        ],
        ["", "", "", ""],
      ],
    },
  ],
} satisfies ContractDocument;
