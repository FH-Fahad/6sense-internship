import { Test, TestingModule } from '@nestjs/testing';
import { DevService } from './dev.service';
import * as bcrypt from 'bcrypt';

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
            //TODO: mock salt and hashedPassword
            const dev = await devService.create(mockDev);
            expect(dev).toEqual(mockDevResponse);

            expect(mockDevService.create).toHaveBeenCalled();
        });
    });
});
