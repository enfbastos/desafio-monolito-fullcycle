import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice-item";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.usecase.dto";

export class GenerateInvoiceUseCase implements UseCaseInterface {
    constructor(private invoiceRepository: InvoiceGateway) {}
  
    async execute(
      input: GenerateInvoiceUseCaseInputDto
    ): Promise<GenerateInvoiceUseCaseOutputDto> {
      const {
        name,
        document,
        street,
        number,
        complement,
        city,
        state,
        zipCode,
        items,
      } = input;
  
      const invoice = new Invoice({
        name,
        document,
        address: new Address(
          street,
          number,
          complement,
          city,
          state,
          zipCode,
        ),
        items: items.map(
          (item) =>
            new InvoiceItem({
              id: new Id(item.id),
              name: item.name,
              price: item.price,
            })
        ),
      });
  
      await this.invoiceRepository.add(invoice);
  
      return {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        items: invoice.items.map((product) => ({
          id: product.id.id,
          name: product.name,
          price: product.price,
        })),
        total: invoice.total,
      };
    }
}
