import { Test, TestingModule } from '@nestjs/testing';
import { DevService } from './dev.service';
// import { InternalServerErrorException } from '@nestjs/common';

const mockDevService = {
    create: jest.fn((dev) => ({ ...dev, id: '660d2eff898f6d8e0c76328d' })),
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
                    useFactory: () => mockDevService
                },
            ],
        }).compile();

        devService = module.get<DevService>(DevService);
    });

    it('should create a new dev', async () => {
        expect(mockDevService.create).not.toHaveBeenCalled();

        const dev = await devService.create(mockDev);
        expect(dev).toEqual(mockDevResponse);

        expect(mockDevService.create).toHaveBeenCalled();
    });

    // it('should throw an error if something goes wrong during creation', async () => {
    //     await expect(devService.create(mockDev)).rejects.toThrow(InternalServerErrorException);
    // });
});
