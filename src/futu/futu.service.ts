import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Trade } from 'src/entity/trade.entity';
import { Repository } from 'typeorm';
import ftWebsocket from 'futu-api';
import { ftCmdID } from 'futu-api';
import { Common, Qot_Common, Trd_Common } from 'futu-api/proto';

@Injectable()
export class FutuService {
  @Inject(ConfigService)
  public config: ConfigService;

  private appName = 'futu';

  constructor(
    @InjectRepository(Trade)
    private tradesRepository: Repository<Trade>,
    config: ConfigService,
  ) {
    // const binanceApiKey: string = config.get('BINANCE_API_KEY');
  }

  async getAccount(): Promise<any> {
    this.TrdGetHistoryOrderList();
    return;
  }

  TrdGetHistoryOrderList() {
    const { RetType } = Common;
    const { TrdEnv, TrdMarket } = Trd_Common;
    const [addr, port, enable_ssl, key] = [
      '127.0.0.1',
      11111,
      false,
      'ec16fde057a2e7a0',
    ];
    const websocket = new ftWebsocket();

    websocket.onlogin = (ret, msg) => {
      if (ret) {
        websocket
          .GetAccList({
            c2s: {
              userID: 0,
            },
          })
          .then((res) => {
            const {
              retType,
              s2c: { accList },
            } = res;
            if (retType == RetType.RetType_Succeed) {
              const acc = accList.filter((item) => {
                return (
                  item.trdEnv == TrdEnv.TrdEnv_Simulate &&
                  item.trdMarketAuthList.some((auth) => {
                    return auth == TrdMarket.TrdMarket_HK;
                  })
                );
              })[0]; // The sample takes the first HK paper trading environment account

              const req = {
                c2s: {
                  header: {
                    trdEnv: acc.trdEnv,
                    accID: acc.accID,
                    trdMarket: TrdMarket.TrdMarket_HK,
                  },
                  filterConditions: {
                    beginTime: '2021-09-01 00:00:00',
                    endTime: '2021-09-30 00:00:00',
                  },
                },
              };

              websocket
                .GetHistoryOrderList(req)
                .then((res) => {
                  const { errCode, retMsg, retType, s2c } = res;
                  console.log(
                    'GetHistoryOrderList: errCode %d, retMsg %s, retType %d',
                    errCode,
                    retMsg,
                    retType,
                  );
                  if (retType == RetType.RetType_Succeed) {
                    const data = JSON.stringify(s2c);
                    console.log(data);
                  }
                })
                .catch((error) => {
                  console.log('error:', error);
                });
            }
          })
          .catch((error) => {
            console.log('GetAccList error:', error);
          });
      } else {
        console.log('error', msg);
      }
    };

    websocket.start(addr, port, enable_ssl, key);

    // After using the connection, remember to close it to prevent the number of connections from running out
    setTimeout(() => {
      websocket.stop();
      console.log('stop');
    }, 5000); // Set the script to receive FutuOpenD push duration to 5 seconds
  }
}
