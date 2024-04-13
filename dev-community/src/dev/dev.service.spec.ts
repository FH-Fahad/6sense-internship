import { Test, TestingModule } from '@nestjs/testing';
import { DevService } from './dev.service';
import * as bcrypt from 'bcrypt';
import Mongoose from 'mongoose';

const mockDevService = {
    create: jest.fn((dev) => ({ ...dev, id: '660d2eff898f6d8e0c76328d' })),

    findOne: jest.fn((devId) => ({ ...devId }))
};

const mockDev = {
    email: 'test@gmail.com',
    password: 'password',
    skills: 'JavaScript, Node.js',
    experience: 'Intermediate',
};

const mockDevResponse = {
    ...mockDev,
    id: '660d2eff898f6d8e0c76328d',
};

describe('DevService', () => {
    let devService: DevService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DevService,
                {
                    provide: DevService,
                    useValue: mockDevService,
                },
            ],
        }).compile();

        devService = module.get<DevService>(DevService);
    });

    describe('create a dev', () => {

        it('should create a new dev', async () => {
            expect(mockDevService.create).not.toHaveBeenCalled();
            jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

            const dev = await devService.create(mockDev);
            expect(dev).toEqual(mockDevResponse);

            expect(mockDevService.create).toHaveBeenCalled();
        });
    });

    describe('find one dev by dev Id', () => {
        it('should find a dev by id', async () => {
            const devId = new Mongoose.Types.ObjectId('660d2eff898f6d8e0c76328d');

            const mockDevResponse = {
                ...devId
            }

            expect(mockDevService.findOne).not.toHaveBeenCalled();

            const dev = await devService.findOne(devId);
            expect(dev).toEqual(mockDevResponse);

            expect(mockDevService.findOne).toHaveBeenCalled();
        })
    });
});
