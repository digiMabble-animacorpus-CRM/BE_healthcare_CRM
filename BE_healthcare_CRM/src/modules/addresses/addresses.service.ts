import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Address } from "./entities/address.entity";
import { CreateAddressDto } from "./dto/create-address.dto";
import { BaseService } from 'src/base.service';
@Injectable()
export class AddressesService extends BaseService<Address> {
  protected repository: Repository<Address>;

  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>
  ) {
    super(addressRepository.manager);
    this.repository = addressRepository;
  }

  async findOne(id: number): Promise<Address> {
    return this.addressRepository.findOne({ where: { id } });
  }

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const address = this.addressRepository.create(createAddressDto);
    return this.addressRepository.save(address);
  }
}
