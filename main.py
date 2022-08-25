import os

images = os.listdir(os.path.join(os.curdir, 'PNG-cards-1.3'))
folder = 'PNG-cards-1.3'
for file in images:
    number = file.split('_')[0]
    house = file.split('_')[2]
    print(file)
    match house[:2]:
        case 'cl':
            os.rename(os.path.join(folder, file), os.path.join(folder, f'{number}_C.png'))
        case 'he':
            os.rename(os.path.join(folder, file), os.path.join(folder, f'{number}_H.png'))
        case 'di':
            os.rename(os.path.join(folder, file), os.path.join(folder, f'{number}_D.png'))
        case 'sp':
            os.rename(os.path.join(folder, file), os.path.join(folder, f'{number}_S.png'))
            
for file in images:
    print(file)