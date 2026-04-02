import { PairData } from '../model/PairData';
import { CriteriaDetail } from '../model/CriteriaDetail';
import { EvaluationDetail } from '../model/Evaluation';
import { Behavior } from '../model/Behavior';
import { Cluster } from '../model/Clusters';

export const dataSyncService = {
  async saveToFile(dataList: (PairData | EvaluationDetail | CriteriaDetail | Behavior | Cluster)[], dataType: string) {
    const jsonStr = JSON.stringify(dataList, null, 2); // 들여쓰기 2칸으로 보기 좋게
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataType}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // 메모리 해제
    // postForEntity(`${SERVER_BASE_URL}/data/save_to_file`, {
    //   dataList,
    //   dataType,
    // }).then((response) => {
    //   console.log(response);
    // });
  },
};
