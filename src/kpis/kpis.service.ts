import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kpi } from './kpis.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KpisService {
  constructor(
    @InjectRepository(Kpi)
    private kpiRepository: Repository<Kpi>,
  ) {}

  async getKpis(): Promise<Kpi[]> {
    return this.kpiRepository.find();
  }
}
